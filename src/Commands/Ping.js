"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
class Ping extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'ping';
        this.CommandDescription = 'Pings the Server to See if it Still Running';
        this.IsCommandBlocking = true;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            this.InitializeUserResponse(interaction, `Pinging Server`);
            PalworldRestfulCommands_1.default.PingServer(this, client);
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = Ping;
