import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class Ping extends Command {

    public CommandName: string = 'ping';

    public CommandDescription: string = 'Pings the Server to See if it Still Running';

    public IsCommandBlocking: boolean = true;

    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        this.InitializeUserResponse(interaction, `Pinging Server`);

        await PalworldRestfulCommands.PingServer(this);

        await PalworldRestfulCommands.UpdateServerInfo(client);
    };

    public IsEphemeralResponse: boolean = true;
}

export = Ping;