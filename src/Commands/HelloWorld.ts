import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotDataManager, Command } from "dna-discord-framework";

class HelloWorld extends Command {

    /* <inheritdoc> */
    public CommandName: string = 'helloworld';

    /* <inheritdoc> */
    public CommandDescription: string = 'A simple Hello World Command';

    /* <inheritdoc> */
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {
        this.InitializeUserResponse(interaction, "Hello World!");
    };

    /* <inheritdoc> */
    public IsEphemeralResponse: boolean = false;
}

export = HelloWorld;