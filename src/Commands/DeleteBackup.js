"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const fs_1 = __importDefault(require("fs"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
class DeleteBackup extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "deletebackup";
        this.CommandDescription = "Deletes the Current Backup File on the Server to be Replaced with a New One.";
        this.RunCommand = async (client, interaction, BotDataManager) => {
            const dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            if (fs_1.default.existsSync("/home/steam/Backups/WorldBackup.tar.gz")) {
                this.InitializeUserResponse(interaction, `Removing Backup File from Server`);
                try {
                    let runner = new dna_discord_framework_1.BashScriptRunner();
                    runner.RunLocally(`rm -rf /home/steam/Backups/WorldBackup.tar.gz`);
                    this.AddToResponseMessage("Backup File Removed Successfully");
                }
                catch (error) {
                    this.AddToResponseMessage("Could not Remove Backup File from Server.");
                }
            }
            else
                this.InitializeUserResponse(interaction, `No Backup File Found on Server.`);
            this.AddToResponseMessage("Please Provide a Backup File to Load in the /loadbackup Command.");
            this.AddToResponseMessage("If the Backup is too large, send it using the following Command in your Terminal. (May need to remove .gz from the file name)");
            let command = `scp -P ${dataManager.SCP_INFO.Port} "${dataManager.SCP_INFO.DownloadLocation}/WorldBackup.tar.gz" ${dataManager.SCP_INFO.User}@${dataManager.SCP_INFO.HostName}:"${dataManager.SCP_INFO.HostDeviceBackupFolder}"`;
            command = "```" + command + "```";
            this.AddToResponseMessage(command);
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = DeleteBackup;
