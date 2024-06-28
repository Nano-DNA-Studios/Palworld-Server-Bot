import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../RESTFUL/PalworldRestfulCommands";

class Save extends Command {
    public CommandName: string = 'save';
    public CommandDescription: string = 'Save the Palworld Server';
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, `Saving the Game World`);

        PalworldRestfulCommands.SaveWorld(this);

    };
    public IsEphemeralResponse: boolean = false;

}

export = Save;