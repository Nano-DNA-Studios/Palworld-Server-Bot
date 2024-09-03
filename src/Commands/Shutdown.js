"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
class Shutdown extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'shutdown';
        this.CommandDescription = 'Shuts down the Palworld Server';
        this.IsCommandBlocking = true;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            let waittime = interaction.options.getNumber('waittime');
            if (!dataManager.IsServerSetup()) {
                this.InitializeUserResponse(interaction, `You must Setup the Server First using /setup, or Load a Backup using /loadbackup`);
                await PalworldRestfulCommands_1.default.UpdateServerInfo(client);
                return;
            }
            if (waittime) {
                this.InitializeUserResponse(interaction, `Palworld Server is being Shutdown in ${waittime} seconds.`);
                await PalworldRestfulCommands_1.default.ShutdownServer(this, waittime);
                dataManager.OfflineActivity(client);
                dataManager.UpdateShutdownDate();
                this.AddToResponseMessage('Please wait 2 Minutes before starting the Server again');
            }
            await PalworldRestfulCommands_1.default.UpdateServerInfo(client);
        };
        this.IsEphemeralResponse = true;
        this.Options = [
            {
                name: 'waittime',
                description: 'Force the',
                type: dna_discord_framework_1.OptionTypesEnum.Number,
                required: true,
                choices: [
                    {
                        name: '10 seconds',
                        value: 10
                    },
                    {
                        name: '20 seconds',
                        value: 20
                    },
                    {
                        name: '30 seconds',
                        value: 30
                    }
                ]
            }
        ];
    }
}
module.exports = Shutdown;
