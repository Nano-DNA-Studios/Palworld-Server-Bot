import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotDataManager, Command } from "dna-discord-framework";

class StartServer extends Command
{
    public CommandName: string = 'startserver';
    public CommandDescription: string = 'Starts the Palworld Server';
    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {


        this.InitializeUserResponse(interaction, `Starting Server`);
        try 
        {
            let scriptRunner = new BashScriptRunner();

            scriptRunner.RunLocally("cd /home/steam/PalworldServer && ./PalServer.sh");

            this.AddToResponseMessage("Server Started!");
        } catch (error) {
            this.AddToResponseMessage("Error Starting Server");
            return;
        }

        
    };
    public IsEphemeralResponse: boolean = true;

}

export = StartServer;