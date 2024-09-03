"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
class Status extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "status";
        this.CommandDescription = "Displays the Status of the Palworld Server";
        this.IsCommandBlocking = false;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            const dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            if (!dataManager.IsServerSetup()) {
                this.InitializeUserResponse(interaction, "Server is not setup yet. Use /setup or /loadbackup to setup the server");
                return;
            }
            let online = await PalworldRestfulCommands_1.default.IsServerOnline();
            if (!online) {
                this.InitializeUserResponse(interaction, "Server is Offline, Status cannot be retrieved");
                return;
            }
            await PalworldRestfulCommands_1.default.UpdateServerInfo(client);
            this.InitializeUserResponse(interaction, `${dataManager.SERVER_NAME} Server \n\nPlayers Online: ${dataManager.SERVER_METRICS.PlayerNum} \nServer Uptime: ${dataManager.SERVER_METRICS.GetUptime()} \nTime Since Last Backup: ${dataManager.GetTimeSinceLastBackup()}`);
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = Status;
