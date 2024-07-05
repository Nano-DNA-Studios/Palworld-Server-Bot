"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldRESTFUL/PalworldRestfulCommands"));
class Ping extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'ping';
        this.CommandDescription = 'Pings the Server to See if it Still Running';
        this.RunCommand = async (client, interaction, BotDataManager) => {
            this.InitializeUserResponse(interaction, `Pinging Server`);
            PalworldRestfulCommands_1.default.PingServer(this, client);
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = Ping;
