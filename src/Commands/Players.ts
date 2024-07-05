import { BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../RESTFUL/PalworldRestfulCommands";
import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";



class Players extends Command {

    public CommandName: string = 'players';

    public CommandDescription: string = 'Returns the Players in the Palworld Server';

    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, dataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, `Getting Players Online`);

        PalworldRestfulCommands.GetPlayers(this, client);
    };

    public IsEphemeralResponse: boolean = true;
}

export = Players;