"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
class Players extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'players';
        this.CommandDescription = 'Returns the Players in the Palworld Server';
        this.IsCommandBlocking = false;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            await PalworldRestfulCommands_1.default.UpdateServerInfo(client);
            let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            this.InitializeUserResponse(interaction, dataManager.PLAYER_DATABASE.GetPlayersDisplay());
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = Players;
