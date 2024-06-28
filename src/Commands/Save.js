"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../RESTFUL/PalworldRestfulCommands"));
class Save extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'save';
        this.CommandDescription = 'Save the Palworld Server';
        this.RunCommand = async (client, interaction, BotDataManager) => {
            this.InitializeUserResponse(interaction, `Saving the Game World`);
            PalworldRestfulCommands_1.default.SaveWorld(this);
        };
        this.IsEphemeralResponse = false;
    }
}
module.exports = Save;
