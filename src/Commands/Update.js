"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
class Update extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "update";
        this.CommandDescription = "Updates the Palworld Server";
        this.RunCommand = async (client, interaction, BotDataManager) => {
            const dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            this.InitializeUserResponse(interaction, `Updating Palworld Server`);
            await PalworldRestfulCommands_1.default.ShutdownServer(this, client, 10);
            setTimeout(async () => {
                await dataManager.CreateBackup();
                this.AddToResponseMessage("Updating Server");
                await new dna_discord_framework_1.BashScriptRunner().RunLocally(`steamcmd +force_install_dir /home/steam/PalworldServer/ +login anonymous +app_update 2394010 validate +quit`);
                this.AddToResponseMessage("Server Updated");
            }, 10000);
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = Update;
