import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";

class ForceStop extends Command {

    public CommandName: string = "forcestop";

    public CommandDescription: string = "Force Stops the Palworld Server";

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, `Force Stopping the Palworld Server`);

        PalworldRestfulCommands.ForceStop(this, client)

    };

    public IsEphemeralResponse: boolean = false;
}

export = ForceStop;