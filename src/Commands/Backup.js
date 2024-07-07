"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const promises_1 = __importDefault(require("fs/promises"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
class Backup extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "backup";
        this.CommandDescription = "Makes a Backup of the Palworld World";
        this.RunCommand = async (client, interaction, BotDataManager) => {
            this.InitializeUserResponse(interaction, `Creating Backup of World`);
            const dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            const backupFilePath = "/home/steam/Backups/WorldBackup.tar.gz";
            dataManager.CreateBackup();
            const fileStats = await promises_1.default.stat(backupFilePath);
            const sizeAndFormat = this.GetFileSize(fileStats);
            if (sizeAndFormat[0] > this.MAX_FILE_SIZE_MB && sizeAndFormat[1] == "MB") {
                this.AddToResponseMessage("File is too large, Download it using the following Command in your Terminal");
                let command = `scp -P ${dataManager.SCP_INFO.Port} ${dataManager.SCP_INFO.User}@${dataManager.SCP_INFO.HostName}:"${dataManager.SCP_INFO.HostDeviceBackupFolder}/WorldBackup.tar.gz" "${dataManager.SCP_INFO.DownloadLocation}"`;
                command = "```" + command + "```";
                this.AddToResponseMessage(command);
            }
            else
                this.AddFileToResponseMessage(backupFilePath);
            PalworldRestfulCommands_1.default.UpdateServerMetrics(client);
        };
        this.IsEphemeralResponse = true;
        this.MAX_FILE_SIZE_MB = 80;
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
module.exports = Backup;
