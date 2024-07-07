"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
class Start extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'start';
        this.CommandDescription = 'Starts the Palworld Server';
        this.RunCommand = async (client, interaction, BotDataManager) => {
            this.InitializeUserResponse(interaction, `Starting Server`);
            PalworldRestfulCommands_1.default.StartServer(this, client);
        };
        this.IsEphemeralResponse = true;
    }
    async Sleep(milliseconds) {
        return await setTimeout(() => { }, milliseconds);
    }
}
module.exports = Start;
