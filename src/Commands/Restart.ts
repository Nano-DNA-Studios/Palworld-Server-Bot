import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class Restart extends Command {

    public CommandName: string = 'restart';

    public CommandDescription: string = 'Restarts the Palworld Server';

    public IsCommandBlocking: boolean = true;

    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        let dataManager = BotData.Instance(PalworldServerBotDataManager);

        this.InitializeUserResponse(interaction, `Restarting Server`);

        await PalworldRestfulCommands.ShutdownServer(this, client, 10);

        await this.AddToResponseMessage('Server will be back online in 2 Minutes');

        await setTimeout(async () => {
            this.AddToResponseMessage('Starting Server');

            await PalworldRestfulCommands.StartServer(this, client);
        }, 120000);
    };

    public IsEphemeralResponse: boolean = true;
}

export = Restart;