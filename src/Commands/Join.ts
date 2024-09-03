import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";


class Join extends Command {
    public CommandName: string = "join";

    public CommandDescription: string = "Replies with the Info to Join the Palworld Server";

    public IsCommandBlocking: boolean = false;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        const dataManager = BotData.Instance(PalworldServerBotDataManager);
        const connection = dataManager.SERVER_CONNECTION_PORT;
        const connectionInfo = "```" + connection + "```";

        dataManager.UpdateConnectionInfo().then(() => {
            this.InitializeUserResponse(interaction, `You can Join ${dataManager.SERVER_NAME} by using the following Connection Info:`);
            this.AddToResponseMessage(connectionInfo);
        });

        await PalworldRestfulCommands.UpdateServerInfo(client);
    };

    public IsEphemeralResponse: boolean = true;

}

export = Join