import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../RESTFUL/PalworldRestfulCommands";

class ServerSettings extends Command {
    public CommandName: string = 'serversettings';
    public CommandDescription: string = 'Returns the Server Settings for the Palworld Server';
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, `Saving the Game World`);

        PalworldRestfulCommands.ServerSettings(this);

        PalworldRestfulCommands.UpdateServerMetrics(this, client);

    };
    public IsEphemeralResponse: boolean = false;

}

export = ServerSettings;