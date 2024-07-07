import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";

class Ping extends Command {

    public CommandName: string = 'ping';

    public CommandDescription: string = 'Pings the Server to See if it Still Running';
    
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, `Pinging Server`);

        PalworldRestfulCommands.PingServer(this, client);
    };

    public IsEphemeralResponse: boolean = true;
}

export = Ping;