"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../RESTFUL/PalworldRestfulCommands"));
class Shutdown extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'shutdown';
        this.CommandDescription = 'Shuts down the Palworld Server';
        this.RunCommand = async (client, interaction, BotDataManager) => {
            this.InitializeUserResponse(interaction, `Palworld Server is being Shutdown`);
            PalworldRestfulCommands_1.default.ShutdownServer().then((res) => {
                console.log(res);
                setTimeout(() => { PalworldRestfulCommands_1.default.PingServer(this); }, 3000);
            }).catch((error) => {
                this.AddToResponseMessage("Error Shutting Down Server");
            });
        };
        this.IsEphemeralResponse = false;
    }
    async Sleep(milliseconds) {
        return await setTimeout(() => { }, milliseconds);
    }
}
module.exports = Shutdown;
