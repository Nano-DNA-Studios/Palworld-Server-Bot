import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command } from "dna-discord-framework";
import PalworldRestfulCommands from "../PalworldRESTFUL/PalworldRestfulCommands";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import { run } from "tslint/lib/runner";

class Backup extends Command {

    public CommandName: string = "backup";

    public CommandDescription: string = "Makes a Backup of the Palworld World";

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        let dataManager = BotData.Instance(PalworldServerBotDataManager)

        this.InitializeUserResponse(interaction, `Creating Backup of World`);

        let runner = new BashScriptRunner();

        const worldSavePath = dataManager.PALWORLD_GAME_FILES;

        const backupFilePath = "/home/steam/Backups/WorldBackup.tar.gz";

        runner.RunLocally(`cd ${worldSavePath} && cd .. && tar -czvf ${backupFilePath} Saved/*`)

        this.AddFileToResponseMessage(backupFilePath)

    };

    public IsEphemeralResponse: boolean = true;
}

export = Backup;