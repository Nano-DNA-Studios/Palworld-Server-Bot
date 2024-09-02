"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
class Join extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "join";
        this.CommandDescription = "Replies with the Info to Join the Palworld Server";
        this.IsCommandBlocking = false;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            const dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            const connection = dataManager.SERVER_CONNECTION_PORT;
            dataManager.UpdateConnectionInfo().then(() => {
                this.InitializeUserResponse(interaction, `You can Join ${dataManager.SERVER_NAME} by using the following Connection Info: ${connection}`);
            });
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = Join;
