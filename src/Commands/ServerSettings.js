"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldRESTFUL/PalworldRestfulCommands"));
class ServerSettings extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'serversettings';
        this.CommandDescription = 'Returns the Server Settings for the Palworld Server';
        this.RunCommand = async (client, interaction, BotDataManager) => {
            this.InitializeUserResponse(interaction, `Server Settings: `);
            PalworldRestfulCommands_1.default.ServerSettings(this, client);
        };
        this.IsEphemeralResponse = false;
    }
}
module.exports = ServerSettings;
