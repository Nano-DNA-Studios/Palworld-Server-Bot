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
            try {
                await PalworldRestfulCommands_1.default.ShutdownServer(this, client, 15);
            }
            catch (error) {
                this.AddToResponseMessage("Server is already offline");
            }
            setTimeout(async () => {
                await dataManager.CreateBackup();
                this.AddToResponseMessage("Updating Server");
                await new dna_discord_framework_1.BashScriptRunner().RunLocally(dataManager.UPDATE_SCRIPT);
                this.AddToResponseMessage("Server Updated");
            }, 10000);
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = Update;
