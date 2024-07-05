import { BotDataManager } from "dna-discord-framework";
import ServerMetrics from "./ServerObjects/ServerMetrics";
import { Client, ActivityType } from "discord.js";

class PalworldServerBotDataManager extends BotDataManager {

    SERVER_PATH: string = '/home/steam/PalworldServer';

    START_SETTINGS_FILE_PATH = '../Files/StartSettings.ini'

    DEFAULT_FILE_SETTINGS_PATH = '/home/steam/PalworldServer/DefaultPalWorldSettings.ini'

    SERVER_SETTINGS_FILE_PATH = '/home/steam/PalworldServer/Pal/Saved/Config/LinuxServer/PalWorldSettings.ini'

    SERVER_SETTINGS_DIR = '/home/steam/PalworldServer/Pal/Saved/Config/LinuxServer'

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

    PALWORLD_GAME_FILES = "/home/steam/PalworldServer/Pal/Saved"

    public UpdateMetricsStatus(metrics: ServerMetrics, client: Client): void {
        let message = `Palworld Server : Players Online: ${metrics.PlayerNum} \nServer Uptime: ${metrics.GetUptime()} `;

        if (client.user) {
            if (metrics.Uptime == 0 || metrics.Uptime == undefined)
                client.user.setActivity("Server Offline", { type: ActivityType.Playing });
            else
                client.user.setActivity(message, { type: ActivityType.Playing });
        }
    }

}

export default PalworldServerBotDataManager;