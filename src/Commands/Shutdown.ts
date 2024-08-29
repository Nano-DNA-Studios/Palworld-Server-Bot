import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";

class Shutdown extends Command {
    public CommandName: string = 'shutdown';
    public CommandDescription: string = 'Shuts down the Palworld Server';
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        let waittime = interaction.options.getNumber('waittime');

        if (waittime)
        {
            this.InitializeUserResponse(interaction, `Palworld Server is being Shutdown in ${waittime} seconds.`);
            await PalworldRestfulCommands.ShutdownServer(this, client, waittime);

            //Add a last shutdown date to the BotDataManager, then in the start command we check for the last time we shut down, if it's less than 2 minutes, we wait 2 minutes before starting the server
            this.AddFileToResponseMessage('Please wait 2 Minutes before starting the Server again');
        }
    };
    public IsEphemeralResponse: boolean = false;

    public Options?: ICommandOption[] = [
        {
            name: 'waittime',
            description: 'Force the',
            type: OptionTypesEnum.Number,
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

export = Shutdown;