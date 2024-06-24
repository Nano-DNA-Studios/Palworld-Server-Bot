import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";

import * as fs from 'fs';
import * as ini from 'ini';
import * as path from 'path';
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import ServerSettingsEnum from "../Options/ServerSettingsEnum";


class Setup extends Command {
    
    CommandName: string = 'setup';

    CommandDescription: string = 'Sets up the Server for the First Time';

    public Section: string = '/Script/Pal';

    public PalGameWorldSettings: string = 'PalGameWorldSettings';

    public OptionSettings: string = 'OptionSettings';

    public ConfigFile: any;

    public Settings: string = '';

    public ServerSettingsArray: string[] = [];

    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        const serverName = interaction.options.getString('servername');
        const serverDesc = interaction.options.getString('serverdescription');

        this.InitializeUserResponse(interaction, `Changing Default Settings`)

        try 
        {
            this.LoadSettings();
    
            if (serverName)
                this.SetSettingValue(ServerSettingsEnum.ServerName, serverName);
    
            if (serverDesc)
                this.SetSettingValue(ServerSettingsEnum.ServerDescription, serverDesc);
    
            this.SaveSettings();

            this.AddToResponseMessage("Settings Updated!")
    
        } catch (error) {
            this.AddToResponseMessage("Error Changing Settings")
            return;
        }
    };

    public IsEphemeralResponse: boolean = true;

    public Options?: ICommandOption[] = [
        {
            name: 'servername',
            description: 'The Name of the Server',
            required: true,
            type: OptionTypesEnum.String
        },
        {
            name: 'serverdescription',
            description: 'The Description for the Server',
            required: true,
            type: OptionTypesEnum.String
        }
    ];

    public LoadSettings(): void {
        const DataManager = BotData.Instance(PalworldServerBotDataManager)
        const filePath = path.resolve(__dirname, DataManager.START_SETTINGS_FILE_PATH);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        this.ConfigFile = ini.parse(fileContent);
        this.Settings = this.ConfigFile[this.Section][this.PalGameWorldSettings][this.OptionSettings];
        this.ServerSettingsArray = this.Settings.slice(1, -1).split(',');
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

    public SetSettingValue(settingName: ServerSettingsEnum, settingValue: string): void {
        let serverNameIndex = this.ServerSettingsArray.findIndex((setting: string) => setting.trim().startsWith(`${settingName}=`));
        if (serverNameIndex !== -1)
            this.ServerSettingsArray[serverNameIndex] = `${settingName}="${settingValue}"`;
    }

}

export = Setup;