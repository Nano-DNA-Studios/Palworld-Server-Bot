import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class Shutdown extends Command {

    public CommandName: string = 'shutdown';

    public CommandDescription: string = 'Shuts down the Palworld Server';

    public IsCommandBlocking: boolean = true;

    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        let dataManager = BotData.Instance(PalworldServerBotDataManager);
        let waittime = interaction.options.getNumber('waittime');

        if (!dataManager.IsServerSetup()) {
            this.InitializeUserResponse(interaction, `You must Setup the Server First using /setup, or Load a Backup using /loadbackup`);
            await PalworldRestfulCommands.UpdateServerInfo(client);
            return;
        }

        if (waittime) {
            this.InitializeUserResponse(interaction, `Palworld Server is being Shutdown in ${waittime} seconds.`);
            await PalworldRestfulCommands.ShutdownServer(this, waittime);

            dataManager.OfflineActivity(client);
            dataManager.UpdateShutdownDate();
            this.AddToResponseMessage('Please wait 2 Minutes before starting the Server again');
        }

        await PalworldRestfulCommands.UpdateServerInfo(client);
    };

    public IsEphemeralResponse: boolean = true;

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