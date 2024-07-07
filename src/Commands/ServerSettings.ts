import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";

class ServerSettings extends Command {

    public CommandName: string = 'serversettings';

    public CommandDescription: string = 'Returns the Server Settings for the Palworld Server';

    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, `Server Settings: `);

        PalworldRestfulCommands.ServerSettings(this, client);
    };
    
    public IsEphemeralResponse: boolean = false;
}

export = ServerSettings;