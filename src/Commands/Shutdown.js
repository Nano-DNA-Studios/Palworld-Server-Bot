"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
class Shutdown extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'shutdown';
        this.CommandDescription = 'Shuts down the Palworld Server';
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let waittime = interaction.options.getNumber('waittime');
            if (waittime) {
                this.InitializeUserResponse(interaction, `Palworld Server is being Shutdown in ${waittime} seconds.`);
                await PalworldRestfulCommands_1.default.ShutdownServer(this, client, waittime);
                //Add a last shutdown date to the BotDataManager, then in the start command we check for the last time we shut down, if it's less than 2 minutes, we wait 2 minutes before starting the server
                this.AddFileToResponseMessage('Please wait 2 Minutes before starting the Server again');
            }
        };
        this.IsEphemeralResponse = false;
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
