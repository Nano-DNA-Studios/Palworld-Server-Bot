import { BotDataManager } from "dna-discord-framework";

class PalworldServerBotDataManager extends BotDataManager
{
    
    SERVER_PATH: string = '/home/steam/PalworldServer';

    START_SETTINGS_FILE_PATH = '../Files/StartSettings.ini'

    DEFAULT_FILE_SETTINGS_PATH = '/home/steam/PalworldServer/DefaultPalWorldSettings.ini'



}
    
export default PalworldServerBotDataManager;