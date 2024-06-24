"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const fs = __importStar(require("fs"));
const ini = __importStar(require("ini"));
const path = __importStar(require("path"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
const ServerSettingsEnum_1 = __importDefault(require("../Options/ServerSettingsEnum"));
class Setup extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'setup';
        this.CommandDescription = 'Sets up the Server for the First Time';
        this.Section = '/Script/Pal';
        this.PalGameWorldSettings = 'PalGameWorldSettings';
        this.OptionSettings = 'OptionSettings';
        this.Settings = '';
        this.ServerSettingsArray = [];
        this.RunCommand = async (client, interaction, BotDataManager) => {
            const serverName = interaction.options.getString('servername');
            const serverDesc = interaction.options.getString('serverdescription');
            this.InitializeUserResponse(interaction, `Changing Default Settings`);
            try {
                this.LoadSettings();
                if (serverName)
                    this.SetSettingValue(ServerSettingsEnum_1.default.ServerName, serverName);
                if (serverDesc)
                    this.SetSettingValue(ServerSettingsEnum_1.default.ServerDescription, serverDesc);
                this.SaveSettings();
                this.AddToResponseMessage("Settings Updated!");
            }
            catch (error) {
                this.AddToResponseMessage("Error Changing Settings");
                return;
            }
        };
        this.IsEphemeralResponse = true;
        this.Options = [
            {
                name: 'servername',
                description: 'The Name of the Server',
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String
            },
            {
                name: 'serverdescription',
                description: 'The Description for the Server',
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String
            }
        ];
    }
    LoadSettings() {
        const DataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        const filePath = path.resolve(__dirname, DataManager.START_SETTINGS_FILE_PATH);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        this.ConfigFile = ini.parse(fileContent);
        this.Settings = this.ConfigFile[this.Section][this.PalGameWorldSettings][this.OptionSettings];
        this.ServerSettingsArray = this.Settings.slice(1, -1).split(',');
    }
    SaveSettings() {
        this.Settings = '(' + this.ServerSettingsArray.join(',') + ')';
        this.ConfigFile[this.Section][this.PalGameWorldSettings][this.OptionSettings] = this.Settings;
        const DataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        const newFileContent = ini.stringify(this.ConfigFile, { section: '' });
        if (!fs.existsSync(DataManager.SERVER_SETTINGS_DIR))
            fs.mkdirSync(DataManager.SERVER_SETTINGS_DIR, { recursive: true });
        fs.writeFileSync(DataManager.SERVER_SETTINGS_FILE_PATH, newFileContent);
    }
    SetSettingValue(settingName, settingValue) {
        let serverNameIndex = this.ServerSettingsArray.findIndex((setting) => setting.trim().startsWith(`${settingName}=`));
        if (serverNameIndex !== -1)
            this.ServerSettingsArray[serverNameIndex] = `${settingName}="${settingValue}"`;
    }
}
module.exports = Setup;
