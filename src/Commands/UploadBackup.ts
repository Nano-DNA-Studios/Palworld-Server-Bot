import { Client, ChatInputCommandInteraction, CacheType, Attachment } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import fs from "fs";
import axios from "axios";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import ServerSettingsManager from "../PalworldServer/ServerSettingsManager";
import PalworldServerSettingsEnum from "../PalworldServer/Enums/PalworldServerSettingsEnum";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";
import SCPInfo from "../PalworldServer/Objects/SCPInfo";

class UploadBackup extends Command {

    public CommandName: string = "uploadbackup";

    public CommandDescription: string = "Uploads a Backup World to the Server and replaces the Current one.";

    public IsCommandBlocking: boolean = true;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        
        let dataManager = BotData.Instance(PalworldServerBotDataManager);
        const backupfile = interaction.options.getAttachment("backupfile");

        if (backupfile) {

            this.InitializeUserResponse(interaction, `Loading Backup of World`);

            try {
                await this.DownloadFile(backupfile, `${dataManager.BACKUPS_DIR}/WorldBackup.tar.gz`);

                this.AddToResponseMessage("Backup File Downloaded Successfully, Loading Backup Data");
            } catch (error) {
                this.AddToResponseMessage("Error Downloading Backup File");
            }

            await this.LoadBackupData();
            await this.ReplaceServerSettings();

            dataManager.ServerLoadedOrSetup();

            this.AddToResponseMessage("Backup Loaded Successfully, use /start to Start the Server at the backup point");
        } else {
            dataManager.SCP_INFO = new SCPInfo(dataManager.SCP_INFO);

            if (dataManager.SCP_INFO.IsUndefined()) {
                this.InitializeUserResponse(interaction, `No SCP Info Registered, Please Register it using /registerbackup`);
                return
            }

            this.InitializeUserResponse(interaction, `No Backup File Provided, if you have a Backup file rerun the command and provide the file.`);
            this.AddToResponseMessage("If the File is too large, Upload it using the following Command in your Terminal");
            let command = "```" + `scp -P ${dataManager.SCP_INFO.Port} "${dataManager.SCP_INFO.DownloadLocation}\\WorldBackup.tar.gz" ${dataManager.SCP_INFO.User}@${dataManager.SCP_INFO.HostName}:"${dataManager.SCP_INFO.HostDeviceBackupFolder}/WorldBackup.tar.gz"` + "```";
            this.AddToResponseMessage(command);
        }
        
        await PalworldRestfulCommands.UpdateServerInfo(client);
    };

    public IsEphemeralResponse: boolean = true;

    public Options?: ICommandOption[] = [
        {
            name: "backupfile",
            description: "The Backup File to Load",
            required: false,
            type: OptionTypesEnum.Attachment
        }
    ];

    public async LoadBackupData() {
        try {
            const dataManager = BotData.Instance(PalworldServerBotDataManager);

            let runner = new BashScriptRunner();

            await runner.RunLocally(`rm -rf ${dataManager.SERVER_PATH}/Pal/Saved`)
            await runner.RunLocally(`tar -xzf /home/steam/Backups/WorldBackup.tar.gz -C ${dataManager.SERVER_PATH}/Pal`)
        } catch (error) {
            this.AddToResponseMessage("Error Loading Backup Data");
        }
    }

    private ReplaceServerSettings() {
        let dataManager = BotData.Instance(PalworldServerBotDataManager);

        let serverSettings = new ServerSettingsManager();

        this.AddToResponseMessage("Replacing Server Settings");

        try {
            dataManager.SERVER_NAME = serverSettings.GetSettingValue(PalworldServerSettingsEnum.ServerName);
            dataManager.SERVER_DESCRIPTION = serverSettings.GetSettingValue(PalworldServerSettingsEnum.ServerDescription);
            dataManager.SERVER_ADMIN_PASSWORD = serverSettings.GetSettingValue(PalworldServerSettingsEnum.AdminPassword);

            this.AddToResponseMessage("Server Settings Replaced Successfully");

            dataManager.SaveData();
        } catch (error) {
            this.AddToResponseMessage("Error Replacing Server Settings");
        }
    }

    private async DownloadFile(attachment: Attachment, downloadPath: string) {
        try {
            const response = await axios({
                method: 'GET',
                url: attachment.url,
                responseType: 'stream',
            });

            const writer = fs.createWriteStream(downloadPath);

            response.data.pipe(writer);

            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        } catch (error) {
            console.error(`Failed to download the file: ${error}`);
        }
    }
}

export = UploadBackup;