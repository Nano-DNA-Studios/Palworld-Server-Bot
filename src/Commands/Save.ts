import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";

class Save extends Command {

    public CommandName: string = 'save';

    public CommandDescription: string = 'Save the Palworld Server';

    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, `Saving the Game World`);

        PalworldRestfulCommands.SaveWorld(this, client);

    };

    public IsEphemeralResponse: boolean = true;
}

export = Save;