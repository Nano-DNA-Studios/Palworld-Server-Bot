import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class ServerSettings extends Command {

    public CommandName: string = 'serversettings';

    public CommandDescription: string = 'Returns the Server Settings for the Palworld Server';

    public IsCommandBlocking: boolean = false;

    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        this.InitializeUserResponse(interaction, `Server Settings: `);

        await PalworldRestfulCommands.ServerSettings(this);

        await PalworldRestfulCommands.UpdateServerInfo(client);
    };

    public IsEphemeralResponse: boolean = false;
}

export = ServerSettings;