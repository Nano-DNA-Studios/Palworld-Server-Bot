import { BotData, BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";
import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class Players extends Command {

    public CommandName: string = 'players';

    public CommandDescription: string = 'Returns the Players in the Palworld Server';

    public IsCommandBlocking: boolean = false;

    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        await PalworldRestfulCommands.UpdateServerInfo(client);

        let dataManager = BotData.Instance(PalworldServerBotDataManager);

        this.InitializeUserResponse(interaction, dataManager.PLAYER_DATABASE.GetPlayersDisplay());
    };

    public IsEphemeralResponse: boolean = true;
}

export = Players;