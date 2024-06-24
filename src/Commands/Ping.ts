import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command } from "dna-discord-framework";
import RESTFULRequest from "../RESTFUL/RESTFULRequest";
import RESTFULRequestEnum from "../RESTFUL/RESTFULRequestEnum";
import PalworldRestfulCommands from "../RESTFUL/PalworldRestfulCommands";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";


class Ping extends Command {
    public CommandName: string = 'ping';
    public CommandDescription: string = 'Pings the Server to See if it Still Running';
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, `Pinging Server`);

        this.PingServer();

    };

    private PingServer(): void {

        let ping = PalworldRestfulCommands.PingServer()

        console.log(ping);

        console.log(ping.status);

        console.log(ping.message);

        console.log(ping.error);

        if (ping.status == 200)
            this.AddToResponseMessage("Server is Running");
        else
            this.AddToResponseMessage("Server is Not Running");

    }

    public IsEphemeralResponse: boolean = true;

}

export = Ping;