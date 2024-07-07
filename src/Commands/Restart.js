"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
class Restart extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'restart';
        this.CommandDescription = 'Restarts the Palworld Server';
        this.RunCommand = async (client, interaction, BotDataManager) => {
            this.InitializeUserResponse(interaction, `Restarting Server`);
            await PalworldRestfulCommands_1.default.ShutdownServer(this, client, 10);
            setTimeout(() => {
                this.AddToResponseMessage('Starting Server');
                PalworldRestfulCommands_1.default.StartServer(this, client);
            }, 30000);
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = Restart;
