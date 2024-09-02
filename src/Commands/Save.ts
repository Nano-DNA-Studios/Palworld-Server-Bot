import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class Save extends Command {

    public CommandName: string = 'save';

    public CommandDescription: string = 'Save the Palworld Server';

    public IsCommandBlocking: boolean = true;

    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        let dataManager = BotData.Instance(PalworldServerBotDataManager);   

        if (!dataManager.IsServerSetup()) {
            this.InitializeUserResponse(interaction, `You must Setup the Server First using /setup, or Load a Backup using /loadbackup`);
            return;
        }

        this.InitializeUserResponse(interaction, `Saving the Game World`);

        await PalworldRestfulCommands.SaveWorld(this);

        await PalworldRestfulCommands.UpdateServerInfo(client);
    };

    public IsEphemeralResponse: boolean = true;
}

export = Save;