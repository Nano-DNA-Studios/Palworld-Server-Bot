import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldRESTFUL/PalworldRestfulCommands";

class Start extends Command {

    public CommandName: string = 'start';

    public CommandDescription: string = 'Starts the Palworld Server';

    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        this.InitializeUserResponse(interaction, `Starting Server`);
        PalworldRestfulCommands.StartServer(this, client);
    };

    public IsEphemeralResponse: boolean = true;

    public async Sleep(milliseconds: number) {
        return await setTimeout(() => { }, milliseconds);
    }
}

export = Start;