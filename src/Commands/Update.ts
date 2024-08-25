import { CacheType, ChatInputCommandInteraction, Client } from "discord.js";
import { Command, BotDataManager, BotData, BashScriptRunner } from "dna-discord-framework";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";

class Update extends Command {
    public CommandName: string = "update";

    public CommandDescription: string = "Updates the Palworld Server";

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        const dataManager = BotData.Instance(PalworldServerBotDataManager);

        this.InitializeUserResponse(interaction, `Updating Palworld Server`);

        await PalworldRestfulCommands.ShutdownServer(this, client, 10);

        setTimeout(async ()  => {

            await dataManager.CreateBackup();

            this.AddToResponseMessage("Updating Server");

            await new BashScriptRunner().RunLocally(`steamcmd +force_install_dir /home/steam/PalworldServer/ +login anonymous +app_update 2394010 validate +quit`);
    
            this.AddToResponseMessage("Server Updated");

        }, 10000);
    };

    public IsEphemeralResponse: boolean = true;
}

export = Update;