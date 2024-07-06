import { BashScriptRunner, BotData } from "dna-discord-framework";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class GameWorldManager {

    public static CreateBackup(): void {

        let dataManager = BotData.Instance(PalworldServerBotDataManager)
        let runner = new BashScriptRunner();
        const backupFilePath = "/home/steam/Backups/WorldBackup.tar.gz";

        runner.RunLocally(`cd ${dataManager.PALWORLD_GAME_FILES} && cd .. && tar -czvf ${backupFilePath} Saved/*`)
    }

}

export default GameWorldManager;