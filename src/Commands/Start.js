"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../RESTFUL/PalworldRestfulCommands"));
class Start extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'start';
        this.CommandDescription = 'Starts the Palworld Server';
        this.RunCommand = async (client, interaction, BotDataManager) => {
            this.InitializeUserResponse(interaction, `Starting Server`);
            try {
                let scriptRunner = new dna_discord_framework_1.BashScriptRunner();
                scriptRunner.RunLocally("cd /home/steam/PalworldServer && ./PalServer.sh");
                this.AddToResponseMessage("Waiting a few seconds to Ping Server");
                setTimeout(() => { PalworldRestfulCommands_1.default.PingServer(this, client); }, 10000);
            }
            catch (error) {
                this.AddToResponseMessage("Error Starting Server");
                return;
            }
        };
        this.IsEphemeralResponse = true;
    }
    async Sleep(milliseconds) {
        return await setTimeout(() => { }, milliseconds);
    }
}
module.exports = Start;
