import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum, BashScriptRunner } from "dna-discord-framework";
import * as fs from 'fs';
import * as ini from 'ini';
import * as path from 'path';
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import ServerSettingsEnum from "../Options/ServerSettingsEnum";

class ServerSettingsManager {

    public Section: string = '/Script/Pal';

    public PalGameWorldSettings: string = 'PalGameWorldSettings';

    public OptionSettings: string = 'OptionSettings';

    public ConfigFile: any;

    public Settings: string = '';

    public ServerSettingsArray: string[] = [];

    public SettingsFilePath = '';

    constructor() {

        const dataManager = BotData.Instance(PalworldServerBotDataManager);

        if (fs.existsSync(dataManager.SERVER_SETTINGS_FILE_PATH))
            this.SettingsFilePath = dataManager.SERVER_SETTINGS_FILE_PATH;
        else
            this.SettingsFilePath = dataManager.START_SETTINGS_FILE_PATH

        if (fs.existsSync(dataManager.SERVER_SETTINGS_FILE_PATH))
            console.log('Server Settings File Exists');
        else
            console.log('Server Settings File Does Not Exist');

        this.LoadSettings();

    }

    public SaveSettings(): void {
        this.Settings = '(' + this.ServerSettingsArray.join(',') + ')';
        this.ConfigFile[this.Section][this.PalGameWorldSettings][this.OptionSettings] = this.Settings;
        const DataManager = BotData.Instance(PalworldServerBotDataManager)
        const newFileContent = ini.stringify(this.ConfigFile, { section: '' });

        if (!fs.existsSync(DataManager.SERVER_SETTINGS_DIR))
            fs.mkdirSync(DataManager.SERVER_SETTINGS_DIR, { recursive: true });

        fs.writeFileSync(DataManager.SERVER_SETTINGS_FILE_PATH, newFileContent);
    }

    public LoadSettings(): void {
        const DataManager = BotData.Instance(PalworldServerBotDataManager)
        const filePath = path.resolve(__dirname, this.SettingsFilePath);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        this.ConfigFile = ini.parse(fileContent);
        this.Settings = this.ConfigFile[this.Section][this.PalGameWorldSettings][this.OptionSettings];
        this.ServerSettingsArray = this.Settings.slice(1, -1).split(',');
    }

    public SetSettingValue(settingName: ServerSettingsEnum, settingValue: string): void {
        let serverNameIndex = this.ServerSettingsArray.findIndex((setting: string) => setting.trim().startsWith(`${settingName}=`));
        if (serverNameIndex !== -1)
            this.ServerSettingsArray[serverNameIndex] = `${settingName}="${settingValue}"`;
    }

    public GetSettingValue(settingName: ServerSettingsEnum): string {
        let setting = this.ServerSettingsArray.find((setting: string) => setting.trim().startsWith(`${settingName}=`));
        if (setting)
            return setting.split('=')[1].replace(/"/g, '');
        else
            return '';
    }

}

export default ServerSettingsManager;