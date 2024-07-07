"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
class Players extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'players';
        this.CommandDescription = 'Returns the Players in the Palworld Server';
        this.RunCommand = async (client, interaction, dataManager) => {
            this.InitializeUserResponse(interaction, `Getting Players Online`);
            PalworldRestfulCommands_1.default.GetPlayers(this, client);
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = Players;
