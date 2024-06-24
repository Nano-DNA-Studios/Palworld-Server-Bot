"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
class Shutdown extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'shutdown';
        this.CommandDescription = 'Shuts down the Palworld Server';
        this.RunCommand = async (client, interaction, BotDataManager) => {
            this.InitializeUserResponse(interaction, `Palworld Server is being Shutdown`);
            let bashRunner = new dna_discord_framework_1.BashScriptRunner();
            bashRunner.RunLocally(`pkill "${dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default).SERVER_START_SCRIPT}"`);
            bashRunner.RunLocally(`killall "${dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default).SERVER_PROCESS_NAME}"`);
            bashRunner.RunLocally(`killall "steamcmd"`);
            await this.Sleep(5000);
        };
        this.IsEphemeralResponse = false;
    }
    async Sleep(milliseconds) {
        return await setTimeout(() => { }, milliseconds);
    }
}
module.exports = Shutdown;
