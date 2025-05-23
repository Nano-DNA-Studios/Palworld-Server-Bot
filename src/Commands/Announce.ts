import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";

class Announce extends Command {

    public CommandName: string = 'announce';

    public CommandDescription: string = 'Announces a Message to the Server';

    public IsCommandBlocking: boolean = false;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        const message = interaction.options.getString('message');

        this.InitializeUserResponse(interaction, `Announcing Message: ${message}`);

        if (message)
            await PalworldRestfulCommands.Announce(this, message);

        await PalworldRestfulCommands.UpdateServerInfo(client);
    };

    public IsEphemeralResponse: boolean = true;

    public Options: ICommandOption[] = [
        {
            name: 'message',
            description: 'The message to announce',
            required: true,
            type: OptionTypesEnum.String
        }
    ]
}

export = Announce;