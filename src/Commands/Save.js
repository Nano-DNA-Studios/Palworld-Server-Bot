"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
class Save extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'save';
        this.CommandDescription = 'Save the Palworld Server';
        this.IsCommandBlocking = true;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            if (!dataManager.IsServerSetup()) {
                this.InitializeUserResponse(interaction, `You must Setup the Server First using /setup, or Load a Backup using /loadbackup`);
                return;
            }
            this.InitializeUserResponse(interaction, `Saving the Game World`);
            await PalworldRestfulCommands_1.default.SaveWorld(this);
            await PalworldRestfulCommands_1.default.UpdateServerInfo(client);
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = Save;
