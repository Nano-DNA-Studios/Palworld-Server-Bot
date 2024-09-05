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
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
const SCPInfo_1 = __importDefault(require("../PalworldServer/Objects/SCPInfo"));
class UploadBackup extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "uploadbackup";
        this.CommandDescription = "Uploads a Backup World to the Server and replaces the Current one.";
        this.IsCommandBlocking = true;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            const backupfile = interaction.options.getAttachment("backupfile");
            if (backupfile) {
                this.InitializeUserResponse(interaction, `Loading Backup of World`);
                try {
                    await this.DownloadFile(backupfile, `${dataManager.BACKUPS_DIR}/WorldBackup.tar.gz`);
                    this.AddToResponseMessage("Backup File Downloaded Successfully, Loading Backup Data");
                }
                catch (error) {
                    this.AddToResponseMessage("Error Downloading Backup File");
                }
                await this.LoadBackupData();
                await this.ReplaceServerSettings();
                dataManager.ServerLoadedOrSetup();
                this.AddToResponseMessage("Backup Loaded Successfully, use /start to Start the Server at the backup point");
            }
            else {
                dataManager.SCP_INFO = new SCPInfo_1.default(dataManager.SCP_INFO);
                if (dataManager.SCP_INFO.IsUndefined()) {
                    this.InitializeUserResponse(interaction, `No SCP Info Registered, Please Register it using /registerbackup`);
                    return;
                }
                this.InitializeUserResponse(interaction, `No Backup File Provided, if you have a Backup file rerun the command and provide the file.`);
                this.AddToResponseMessage("If the File is too large, Upload it using the following Command in your Terminal");
                let command = "```" + `scp -P ${dataManager.SCP_INFO.Port} "${dataManager.SCP_INFO.DownloadLocation}\\WorldBackup.tar.gz" ${dataManager.SCP_INFO.User}@${dataManager.SCP_INFO.HostName}:"${dataManager.SCP_INFO.HostDeviceBackupFolder}/WorldBackup.tar.gz"` + "```";
                this.AddToResponseMessage(command);
            }
            await PalworldRestfulCommands_1.default.UpdateServerInfo(client);
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
}
module.exports = UploadBackup;
