"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
class ForceStop extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "forcestop";
        this.CommandDescription = "Force Stops the Palworld Server";
        this.IsCommandBlocking = true;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            this.InitializeUserResponse(interaction, `Force Stopping the Palworld Server`);
            await PalworldRestfulCommands_1.default.ForceStop(this);
            dataManager.OfflineActivity(client);
            await PalworldRestfulCommands_1.default.UpdateServerInfo(client);
        };
        this.IsEphemeralResponse = false;
    }
}
module.exports = ForceStop;
