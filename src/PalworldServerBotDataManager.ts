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

}
    
export default PalworldServerBotDataManager;