import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";

class Restart extends Command {

    public CommandName: string = 'restart';

    public CommandDescription: string = 'Restarts the Palworld Server';

    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, `Restarting Server`);

        await PalworldRestfulCommands.ShutdownServer(this, client, 10);

        setTimeout(() => {  
            this.AddToResponseMessage('Starting Server');
            
            PalworldRestfulCommands.StartServer(this, client); }, 30000);
    };

    public IsEphemeralResponse: boolean = true;
}

export = Restart;