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
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const fs = __importStar(require("fs"));
const ini = __importStar(require("ini"));
const path = __importStar(require("path"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
const ServerSettingsEnum_1 = __importDefault(require("../Options/ServerSettingsEnum"));
class ServerSettingsManager {
    constructor() {
        this.Section = '/Script/Pal';
        this.PalGameWorldSettings = 'PalGameWorldSettings';
        this.OptionSettings = 'OptionSettings';
        this.Settings = '';
        this.ServerSettingsArray = [];
        this.SettingsFilePath = '';
        const dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        if (fs.existsSync(dataManager.SERVER_SETTINGS_FILE_PATH))
            this.SettingsFilePath = dataManager.SERVER_SETTINGS_FILE_PATH;
        else
            this.SettingsFilePath = dataManager.START_SETTINGS_FILE_PATH;
        if (fs.existsSync(dataManager.SERVER_SETTINGS_FILE_PATH))
            console.log('Server Settings File Exists');
        else
            console.log('Server Settings File Does Not Exist');
        this.LoadSettings();
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
    LoadSettings() {
        const DataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        const filePath = path.resolve(__dirname, this.SettingsFilePath);
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        this.ConfigFile = ini.parse(fileContent);
        this.Settings = this.ConfigFile[this.Section][this.PalGameWorldSettings][this.OptionSettings];
        this.ServerSettingsArray = this.Settings.slice(1, -1).split(',');
    }
    SetSettingValue(settingName, settingValue) {
        let serverNameIndex = this.ServerSettingsArray.findIndex((setting) => setting.trim().startsWith(`${settingName}=`));
        if (serverNameIndex !== -1)
            this.ServerSettingsArray[serverNameIndex] = `${settingName}="${settingValue}"`;
    }
    GetSettingValue(settingName) {
        let setting = this.ServerSettingsArray.find((setting) => setting.trim().startsWith(`${settingName}=`));
        if (setting)
            return setting.split('=')[1].replace(/"/g, '');
        else
            return '';
    }
    getEnum(value) {
        const keys = Object.keys(ServerSettingsEnum_1.default);
        for (const key of keys) {
            if (ServerSettingsEnum_1.default[key] === value) {
                return ServerSettingsEnum_1.default[key];
            }
        }
        return ServerSettingsEnum_1.default.None;
    }
}
exports.default = ServerSettingsManager;
