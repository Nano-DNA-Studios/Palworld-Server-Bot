import { Client, ChatInputCommandInteraction, CacheType, Attachment } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import fs from "fs";
import axios from "axios";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class LoadBackup extends Command {

    public CommandName: string = "loadbackup";

    public CommandDescription: string = "Replaces the World Data with the Backup Data";

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        const dataManager = BotData.Instance(PalworldServerBotDataManager);

        const backupfile = interaction.options.getAttachment("backupfile");

        if (backupfile) {

            this.InitializeUserResponse(interaction, `Loading Backup of World`);

            await this.DownloadFile(backupfile, "/home/steam/Backups/WorldBackup.tar.gz");

        } else {
            this.InitializeUserResponse(interaction, `No Backup File Provided, Use the Following Command to Send a Backup File if it is too Large`);

            let command = `scp -P ${dataManager.SCP_INFO.Port} "${dataManager.SCP_INFO.DownloadLocation}" ${dataManager.SCP_INFO.User}@${dataManager.SCP_INFO.HostName}:"${dataManager.SCP_INFO.HostDeviceBackupFolder}/WorldBackup.tar.gz"`;

            command = "```" + command + "```"

            this.AddToResponseMessage(command)
        }

        if (fs.existsSync("/home/steam/Backups/WorldBackup.tar.gz")) {
            //Replace the Data with the Backup Data

            this.AddToResponseMessage("Loading Backup Data into Server");
            try {
                const dataManager = BotData.Instance(PalworldServerBotDataManager);

                let runner = new BashScriptRunner();
        
                runner.RunLocally(`rm -rf ${dataManager.SERVER_PATH}/Pal/Saved`)
        
                runner.RunLocally(`tar -xzf /home/steam/Backups/WorldBackup.tar.gz -C ${dataManager.SERVER_PATH}/Pal`)

                this.AddToResponseMessage("Backup Data Loaded Successfully, use /start to Start the Server at the backup point");
            } catch (error) {
                this.AddToResponseMessage("Error Loading Backup Data");
            }

        }

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

    private MAX_FILE_SIZE_MB: Number = 80;

    // public LoadFile() {

    //     const dataManager = BotData.Instance(PalworldServerBotDataManager);

    //     let runner = new BashScriptRunner();

    //     runner.RunLocally(`rm -rf ${dataManager.SERVER_PATH}/Pal/Saved`)

    //     runner.RunLocally(`tar -xzf /home/steam/Backups/WorldBackup.tar.gz -C ${dataManager.SERVER_PATH}/Pal`)

    //     try {
    //         runner.RunLocally(`tar -xzf /home/steam/Backups/WorldBackup.tar.gz -C ${dataManager.SERVER_PATH}/Pal`)
    //     } catch (error) {

    //         try {
    //             runner.RunLocally(`tar -xf /home/steam/Backups/WorldBackup.tar -C ${dataManager.SERVER_PATH}/Pal`)
    //         } catch (error) {
    //         }

    //     }


    // }

    public async DownloadFile(attachment: Attachment, downloadPath: string) {
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

    GetFileSize(fileStats: fs.Stats): [Number, string] {
        let realsize;
        let sizeFormat;

        if (fileStats.size / (1024 * 1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024 * 1024)) / 100;
            sizeFormat = "MB";
        } else if (fileStats.size / (1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024)) / 100;
            sizeFormat = "KB";
        } else {
            realsize = fileStats.size;
            sizeFormat = "B";
        }

        return [realsize, sizeFormat];
    }
}

export = LoadBackup;