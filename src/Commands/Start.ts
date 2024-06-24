import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../RESTFUL/PalworldRestfulCommands";

class Start extends Command {

    public CommandName: string = 'start';

    public CommandDescription: string = 'Starts the Palworld Server';

    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, `Starting Server`);

        try {
            let scriptRunner = new BashScriptRunner();

            scriptRunner.RunLocally("cd /home/steam/PalworldServer && ./PalServer.sh");

            await this.Sleep(5000);

            //this.AddToResponseMessage("Server is Running");

            setTimeout(() => { this.PingServer() }, 5000)

        } catch (error) {
            this.AddToResponseMessage("Error Starting Server");
            return;
        }

    };

    public IsEphemeralResponse: boolean = true;

    private PingServer(): void {

        let ping = PalworldRestfulCommands.PingServer()

        if (ping.status == 200)
            this.AddToResponseMessage("Server is Running");
        else
            this.AddToResponseMessage("Server is Not Running");

    }

    public async Sleep(milliseconds: number) {
        return await setTimeout(() => { }, milliseconds);
    }

}

export = Start;