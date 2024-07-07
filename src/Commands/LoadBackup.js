"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
const ServerSettingsManager_1 = __importDefault(require("../PalworldServer/ServerSettingsManager"));
const PalworldServerSettingsEnum_1 = __importDefault(require("../PalworldServer/Enums/PalworldServerSettingsEnum"));
class LoadBackup extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "loadbackup";
        this.CommandDescription = "Replaces the World Data with the Backup Data";
        this.RunCommand = async (client, interaction, BotDataManager) => {
            const backupfile = interaction.options.getAttachment("backupfile");
            if (backupfile) {
                this.InitializeUserResponse(interaction, `Loading Backup of World`);
                try {
                    await this.DownloadFile(backupfile, "/home/steam/Backups/WorldBackup.tar.gz");
                    this.AddToResponseMessage("Backup File Downloaded Successfully, Loading Backup Data");
                }
                catch (error) {
                    this.AddToResponseMessage("Error Downloading Backup File");
                }
                await this.LoadBackupData();
                await this.ReplaceServerSettings();
            }
            else {
                if (fs_1.default.existsSync("/home/steam/Backups/WorldBackup.tar")) {
                    let runner = new dna_discord_framework_1.BashScriptRunner();
                    await runner.RunLocally(`mv /home/steam/Backups/WorldBackup.tar /home/steam/Backups/WorldBackup.tar.gz`);
                }
                if (fs_1.default.existsSync("/home/steam/Backups/WorldBackup.tar.gz")) {
                    this.InitializeUserResponse(interaction, `Backup File Already Exists on Server, Loading Backup Data`);
                    await this.LoadBackupData();
                    await this.ReplaceServerSettings();
                }
                else
                    this.InitializeUserResponse(interaction, "No Backup File Found on Server, Please Provide a Backup File to Load.");
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
    }
    async LoadBackupData() {
        try {
            const dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            let runner = new dna_discord_framework_1.BashScriptRunner();
            await runner.RunLocally(`rm -rf ${dataManager.SERVER_PATH}/Pal/Saved`);
            await runner.RunLocally(`tar -xzf /home/steam/Backups/WorldBackup.tar.gz -C ${dataManager.SERVER_PATH}/Pal`);
            this.AddToResponseMessage("Backup Data Loaded Successfully, use /start to Start the Server at the backup point");
        }
        catch (error) {
            this.AddToResponseMessage("Error Loading Backup Data");
        }
    }
    ReplaceServerSettings() {
        let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        let serverSettings = new ServerSettingsManager_1.default();
        this.AddToResponseMessage("Replacing Server Settings");
        try {
            dataManager.SERVER_NAME = serverSettings.GetSettingValue(PalworldServerSettingsEnum_1.default.ServerName);
            dataManager.SERVER_DESCRIPTION = serverSettings.GetSettingValue(PalworldServerSettingsEnum_1.default.ServerDescription);
            dataManager.SERVER_ADMIN_PASSWORD = serverSettings.GetSettingValue(PalworldServerSettingsEnum_1.default.AdminPassword);
            this.AddToResponseMessage("Server Settings Replaced Successfully");
            dataManager.SaveData();
        }
        catch (error) {
            this.AddToResponseMessage("Error Replacing Server Settings");
        }
    }
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
