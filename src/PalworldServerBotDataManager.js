"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const discord_js_1 = require("discord.js");
const SCPInfo_1 = __importDefault(require("./ServerObjects/SCPInfo"));
class PalworldServerBotDataManager extends dna_discord_framework_1.BotDataManager {
    constructor() {
        super(...arguments);
        this.SERVER_PATH = '/home/steam/PalworldServer';
        this.START_SETTINGS_FILE_PATH = '../Files/StartSettings.ini';
        this.DEFAULT_FILE_SETTINGS_PATH = `${this.SERVER_PATH}/DefaultPalWorldSettings.ini`;
        this.SERVER_SETTINGS_FILE_PATH = `${this.SERVER_PATH}/Pal/Saved/Config/LinuxServer/PalWorldSettings.ini`;
        this.SERVER_SETTINGS_DIR = `${this.SERVER_PATH}/Pal/Saved/Config/LinuxServer`;
        this.SERVER_START_SCRIPT = "PalServer.sh";
        this.SERVER_PROCESS_NAME = "PalServer-Linux-Test";
        this.SERVER_PORT = 8211;
        this.RESTFUL_PORT = 8212;
        this.RESTFUL_HOSTNAME = 'localhost';
        this.RESTFUL_GET_METHOD = 'GET';
        this.RESTFUL_POST_METHOD = 'POST';
        this.SERVER_ADMIN_PASSWORD = '';
        this.SERVER_NAME = '';
        this.SERVER_DESCRIPTION = '';
        this.PALWORLD_GAME_FILES = `${this.SERVER_PATH}/Pal/Saved`;
        this.PALWORLD_SERVER_FILES = `${this.SERVER_PATH}/Pal/`;
        this.SCP_INFO = new SCPInfo_1.default(0, '', '', '', '');
    }
    UpdateMetricsStatus(metrics, client) {
        let message = `Palworld Server : Players Online: ${metrics.PlayerNum} \nServer Uptime: ${metrics.GetUptime()} `;
        if (client.user) {
            if (metrics.Uptime == 0 || metrics.Uptime == undefined)
                client.user.setActivity("Server Offline", { type: discord_js_1.ActivityType.Playing });
            else
                client.user.setActivity(message, { type: discord_js_1.ActivityType.Playing });
        }
    }
}
exports.default = PalworldServerBotDataManager;
