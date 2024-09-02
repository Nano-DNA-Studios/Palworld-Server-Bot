import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class Ping extends Command {

    public CommandName: string = 'ping';

    public CommandDescription: string = 'Pings the Server to See if it Still Running';

    public IsCommandBlocking: boolean = true;

    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        let dataManager = BotData.Instance(PalworldServerBotDataManager);

        this.InitializeUserResponse(interaction, `Pinging Server`);

        PalworldRestfulCommands.PingServer(this, client);
    };

    public IsEphemeralResponse: boolean = true;
}

export = Ping;