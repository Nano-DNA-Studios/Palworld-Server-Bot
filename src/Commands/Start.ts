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

            this.AddToResponseMessage("Waiting a few seconds to Ping Server");

            setTimeout(() => { PalworldRestfulCommands.PingServer(this) }, 10000)

        } catch (error) {
            this.AddToResponseMessage("Error Starting Server");
            return;
        }

    };

    public IsEphemeralResponse: boolean = true;

    

    public async Sleep(milliseconds: number) {
        return await setTimeout(() => { }, milliseconds);
    }

}

export = Start;