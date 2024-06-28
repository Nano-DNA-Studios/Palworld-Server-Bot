import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command } from "dna-discord-framework";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import PalworldRestfulCommands from "../RESTFUL/PalworldRestfulCommands";



class Shutdown extends Command {
    public CommandName: string = 'shutdown';
    public CommandDescription: string = 'Shuts down the Palworld Server';
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {


        this.InitializeUserResponse(interaction, `Palworld Server is being Shutdown`);

        PalworldRestfulCommands.ShutdownServer().then((res) => {

            console.log(res);

            setTimeout(() => { PalworldRestfulCommands.PingServer(this) }, 3000)

        }).catch((error) => {
            this.AddToResponseMessage("Error Shutting Down Server");
        });

    };
    public IsEphemeralResponse: boolean = false;

    public async Sleep(milliseconds: number) {
        return await setTimeout(() => { }, milliseconds);
    }

}

export = Shutdown;