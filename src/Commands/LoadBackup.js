"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
class LoadBackup extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "loadbackup";
        this.CommandDescription = "Replaces the World Data with the Backup Data";
        this.RunCommand = async (client, interaction, BotDataManager) => {
            const dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            const backupfile = interaction.options.getAttachment("backupfile");
            if (backupfile) {
                this.InitializeUserResponse(interaction, `Loading Backup of World`);
                await this.DownloadFile(backupfile, "/home/steam/Backups/WorldBackup.tar.gz");
            }
            else {
                this.InitializeUserResponse(interaction, `No Backup File Provided, Use the Following Command to Send a Backup File if it is too Large`);
                let command = `scp -P ${dataManager.SCP_INFO.Port} "${dataManager.SCP_INFO.DownloadLocation}" ${dataManager.SCP_INFO.User}@${dataManager.SCP_INFO.HostName}:"${dataManager.SCP_INFO.HostDeviceBackupFolder}/WorldBackup.tar.gz"`;
                command = "```" + command + "```";
                this.AddToResponseMessage(command);
            }
            if (fs_1.default.existsSync("/home/steam/Backups/WorldBackup.tar.gz")) {
                //Replace the Data with the Backup Data
                this.AddToResponseMessage("Loading Backup Data into Server");
                try {
                    const dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
                    let runner = new dna_discord_framework_1.BashScriptRunner();
                    runner.RunLocally(`rm -rf ${dataManager.SERVER_PATH}/Pal/Saved`);
                    runner.RunLocally(`tar -xzf /home/steam/Backups/WorldBackup.tar.gz -C ${dataManager.SERVER_PATH}/Pal`);
                    this.AddToResponseMessage("Backup Data Loaded Successfully, use /start to Start the Server at the backup point");
                }
                catch (error) {
                    this.AddToResponseMessage("Error Loading Backup Data");
                }
            }
        };
        this.IsEphemeralResponse = true;
        this.Options = [
            {
                name: "backupfile",
                description: "The Backup File to Load",
                required: false,
                type: dna_discord_framework_1.OptionTypesEnum.Attachment
            }
        ];
        this.MAX_FILE_SIZE_MB = 80;
    }
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
    async DownloadFile(attachment, downloadPath) {
        try {
            const response = await (0, axios_1.default)({
                method: 'GET',
                url: attachment.url,
                responseType: 'stream',
            });
            const writer = fs_1.default.createWriteStream(downloadPath);
            response.data.pipe(writer);
            return new Promise((resolve, reject) => {
                writer.on('finish', resolve);
                writer.on('error', reject);
            });
        }
        catch (error) {
            console.error(`Failed to download the file: ${error}`);
        }
    }
    GetFileSize(fileStats) {
        let realsize;
        let sizeFormat;
        if (fileStats.size / (1024 * 1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024 * 1024)) / 100;
            sizeFormat = "MB";
        }
        else if (fileStats.size / (1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024)) / 100;
            sizeFormat = "KB";
        }
        else {
            realsize = fileStats.size;
            sizeFormat = "B";
        }
        return [realsize, sizeFormat];
    }
}
module.exports = LoadBackup;
