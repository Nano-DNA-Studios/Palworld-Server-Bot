import { BotDataManager } from "dna-discord-framework";

class PalworldServerBotDataManager extends BotDataManager
{
    
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

}
    
export default PalworldServerBotDataManager;