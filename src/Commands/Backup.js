"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
class Backup extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "backup";
        this.CommandDescription = "Makes a Backup of the Palworld World";
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            this.InitializeUserResponse(interaction, `Creating Backup of World`);
            let runner = new dna_discord_framework_1.BashScriptRunner();
            const worldSavePath = dataManager.PALWORLD_GAME_FILES;
            const backupFilePath = "/home/steam/Backups/WorldBackup.tar.gz";
            runner.RunLocally(`cd ${worldSavePath} && cd .. && tar -czvf ${backupFilePath} Saved/*`);
            this.AddFileToResponseMessage(backupFilePath);
            // console.log(runner.StandardOutputLogs)
            // runner.RunLocally('cd ..')
            // console.log(runner.StandardOutputLogs)
            // runner.RunLocally('ls')
            // console.log(runner.StandardOutputLogs)
            // runner.RunLocally(``)
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = Backup;
