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

        let online = await PalworldRestfulCommands.IsServerOnline();

        if (online) {
            await this.AddToResponseMessage("Server is Online, Shutdown the Server before Updating");
            return;
        }

        try{
            this.AddToResponseMessage("Updating Server");

            await new BashScriptRunner().RunLocally(dataManager.UPDATE_SCRIPT);
    
            this.AddToResponseMessage("Server Updated");
    
            console.log("Server Updated");
        } catch (error) {
            this.AddToResponseMessage("Error Updating Server");
            console.log("Error Updating Server");
        }
    };

    public IsEphemeralResponse: boolean = true;
}

export = Update;