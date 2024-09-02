import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class Start extends Command {

    public CommandName: string = 'start';

    public CommandDescription: string = 'Starts the Palworld Server';

    public IsCommandBlocking: boolean = true;

    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        let dataManager = BotData.Instance(PalworldServerBotDataManager);

        if (!dataManager.IsServerSetup()) {
            this.InitializeUserResponse(interaction, `You must Setup the Server First using /setup, or Load a Backup using /loadbackup`);
            await PalworldRestfulCommands.UpdateServerInfo(client);
            return;
        }

        if (dataManager.IsSafeToStartServer()) {
            this.InitializeUserResponse(interaction, `Starting Server`);
            await PalworldRestfulCommands.StartServer(this);
        } else
            this.AddToResponseMessage(`You must wait 2 Minutes before starting the Server again`);

        await PalworldRestfulCommands.UpdateServerInfo(client);
    };

    public IsEphemeralResponse: boolean = true;
}

export = Start;