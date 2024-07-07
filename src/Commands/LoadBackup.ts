import { Client, ChatInputCommandInteraction, CacheType, Attachment } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import fs from "fs";
import axios from "axios";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class LoadBackup extends Command {

    public CommandName: string = "loadbackup";

    public CommandDescription: string = "Replaces the World Data with the Backup Data";

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        const backupfile = interaction.options.getAttachment("backupfile");

        if (backupfile) {

            this.InitializeUserResponse(interaction, `Loading Backup of World`);

            try {
                await this.DownloadFile(backupfile, "/home/steam/Backups/WorldBackup.tar.gz");

                this.AddToResponseMessage("Backup File Downloaded Successfully, Loading Backup Data");                
            } catch (error) {
                this.AddToResponseMessage("Error Downloading Backup File");
            }

            this.LoadBackupData();
        } else {

            //Rename the Backup File if it it's not proper
            if (fs.existsSync("/home/steam/Backups/WorldBackup.tar"))
            {
                let runner = new BashScriptRunner();
                await runner.RunLocally(`mv /home/steam/Backups/WorldBackup.tar /home/steam/Backups/WorldBackup.tar.gz`)
            }
               
            if (fs.existsSync("/home/steam/Backups/WorldBackup.tar.gz")) {

                this.InitializeUserResponse(interaction, `Backup File Already Exists on Server, Loading Backup Data`);

                this.LoadBackupData();

            } else
                this.InitializeUserResponse(interaction, "No Backup File Found on Server, Please Provide a Backup File to Load.");
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

    public LoadBackupData() {
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