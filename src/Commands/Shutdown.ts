import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command } from "dna-discord-framework";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";



class Shutdown extends Command {
    public CommandName: string = 'shutdown';
    public CommandDescription: string = 'Shuts down the Palworld Server';
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {


        this.InitializeUserResponse(interaction, `Palworld Server is being Shutdown`);

        let bashRunner = new BashScriptRunner();

        bashRunner.RunLocally(`pkill "${BotData.Instance(PalworldServerBotDataManager).SERVER_START_SCRIPT}"`);

        bashRunner.RunLocally(`killall "${BotData.Instance(PalworldServerBotDataManager).SERVER_PROCESS_NAME}"`);

        bashRunner.RunLocally(`killall "steamcmd"`);

        await this.Sleep(5000);

    };
    public IsEphemeralResponse: boolean = false;

    public async Sleep(milliseconds: number) {
        return await setTimeout(() => {}, milliseconds);
    }
   
}

export = Shutdown;