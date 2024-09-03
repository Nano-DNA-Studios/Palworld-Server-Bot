import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class ForceStop extends Command {

    public CommandName: string = "forcestop";

    public CommandDescription: string = "Force Stops the Palworld Server";

    public IsCommandBlocking: boolean = true;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        let dataManager = BotData.Instance(PalworldServerBotDataManager);

        this.InitializeUserResponse(interaction, `Force Stopping the Palworld Server`);

        await PalworldRestfulCommands.ForceStop(this);

        dataManager.OfflineActivity(client);

        await PalworldRestfulCommands.UpdateServerInfo(client);
    };

    public IsEphemeralResponse: boolean = false;
}

export = ForceStop;