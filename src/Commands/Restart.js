"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
class Restart extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'restart';
        this.CommandDescription = 'Restarts the Palworld Server';
        this.IsCommandBlocking = true;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            this.InitializeUserResponse(interaction, `Restarting Server`);
            await PalworldRestfulCommands_1.default.ShutdownServer(this, 10);
            await this.AddToResponseMessage('Server will be back online in 2 Minutes');
            await setTimeout(async () => {
                this.AddToResponseMessage('Starting Server');
                await PalworldRestfulCommands_1.default.StartServer(this);
            }, 120000);
            await PalworldRestfulCommands_1.default.UpdateServerInfo(client);
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = Restart;
