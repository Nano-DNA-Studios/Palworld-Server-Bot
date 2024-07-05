"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../RESTFUL/PalworldRestfulCommands"));
class ForceStop extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "forcestop";
        this.CommandDescription = "Force Stops the Palworld Server";
        this.RunCommand = async (client, interaction, BotDataManager) => {
            this.InitializeUserResponse(interaction, `Force Stopping the Palworld Server`);
            PalworldRestfulCommands_1.default.ForceStop(this, client);
        };
        this.IsEphemeralResponse = false;
    }
}
module.exports = ForceStop;
