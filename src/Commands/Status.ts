import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";


class Status extends Command {
    public CommandName: string = "status";

    public CommandDescription: string = "Displays the Status of the Palworld Server";

    public IsCommandBlocking: boolean = false;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        const dataManager = BotData.Instance(PalworldServerBotDataManager);

        if (!dataManager.IsServerSetup())
        {
            this.InitializeUserResponse(interaction, "Server is not setup yet. Use /setup or /loadbackup to setup the server");
            return;
        }

        let online = await PalworldRestfulCommands.IsServerOnline();

        if (!online)
        {
            this.InitializeUserResponse(interaction, "Server is Offline, Status cannot be retrieved");
            return;
        }

        await PalworldRestfulCommands.UpdateServerInfo(client);

        this.InitializeUserResponse(interaction, `${dataManager.SERVER_NAME} Server \n\nPlayers Online: ${dataManager.SERVER_METRICS.PlayerNum} \nServer Uptime: ${dataManager.SERVER_METRICS.GetUptime()} \nTime Since Last Backup: ${dataManager.GetTimeSinceLastBackup()}`);
    };

    public IsEphemeralResponse: boolean = true;

}

export = Status