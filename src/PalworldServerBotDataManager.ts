import { BashScriptRunner, BotDataManager } from "dna-discord-framework";
import ServerMetrics from "./PalworldServer/Objects/ServerMetrics";
import { Client, ActivityType } from "discord.js";
import SCPInfo from "./PalworldServer/Objects/SCPInfo";
import AnnouncementMessage from "./PalworldServer/Objects/AnnouncementMessage";
import fs from 'fs';

class PalworldServerBotDataManager extends BotDataManager {

    SERVER_PATH: string = '/home/steam/PalworldServer';

    START_SETTINGS_FILE_PATH = '../PalworldServer/Files/StartSettings.ini'

    DEFAULT_FILE_SETTINGS_PATH = `${this.SERVER_PATH}/DefaultPalWorldSettings.ini`

    SERVER_SETTINGS_FILE_PATH = `${this.SERVER_PATH}/Pal/Saved/Config/LinuxServer/PalWorldSettings.ini`

    SERVER_SETTINGS_DIR = `${this.SERVER_PATH}/Pal/Saved/Config/LinuxServer`

    SERVER_START_SCRIPT = "PalServer.sh";

    SERVER_PROCESS_NAME = "PalServer-Linux-Test";

    SERVER_PORT = 8211;

    RESTFUL_PORT = 8212;

    RESTFUL_HOSTNAME = 'localhost';

    RESTFUL_GET_METHOD = 'GET';

    RESTFUL_POST_METHOD = 'POST';

    SERVER_ADMIN_PASSWORD: string = '';

    SERVER_NAME: string = '';

    SERVER_DESCRIPTION: string = '';

    PALWORLD_GAME_FILES = `${this.SERVER_PATH}/Pal/Saved`

    PALWORLD_SERVER_FILES = `${this.SERVER_PATH}/Pal/`

    SCP_INFO: SCPInfo = new SCPInfo(0, '', '', '', '');

    public UpdateMetricsStatus(metrics: ServerMetrics, client: Client): void {
        let message = `Palworld Server : Players Online: ${metrics.PlayerNum} \nServer Uptime: ${metrics.GetUptime()} `;

        if (client.user) {
            if (metrics.Uptime == 0 || metrics.Uptime == undefined)
                client.user.setActivity("Server Offline", { type: ActivityType.Playing });
            else
                client.user.setActivity(message, { type: ActivityType.Playing });
        }
    }

    public async CreateBackup() {

        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');
            const min = String(now.getMinutes()).padStart(2, '0');
            let timestamp= `${year}_${month}_${day}_${hour}_${min}`;

            const backupFilePath = "/home/steam/Backups/WorldBackup.tar.gz";
            let runner = new BashScriptRunner();
            
            await runner.RunLocally(`cd ${this.PALWORLD_GAME_FILES} && cd .. && tar -czvf ${backupFilePath} Saved/*`)

            if (!fs.existsSync("/home/steam/Backups/Extras"))
                fs.mkdirSync("/home/steam/Backups/Extras", { recursive: true });

            await runner.RunLocally(`cp ${backupFilePath} /home/steam/Backups/Extras/WorldBackup_${timestamp}.tar.gz`)

            new AnnouncementMessage("World has been Backed up Successfully").GetRequest().SendRequest();
        } catch (error) {
            try {
                new AnnouncementMessage("Error Creating Backup").GetRequest().SendRequest();
            } catch (error) {
                console.log("Error Creating Backup")
            }
        }
    }
}

export default PalworldServerBotDataManager;