"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const discord_js_1 = require("discord.js");
class PalworldServerBotDataManager extends dna_discord_framework_1.BotDataManager {
    constructor() {
        super(...arguments);
        this.SERVER_PATH = '/home/steam/PalworldServer';
        this.START_SETTINGS_FILE_PATH = '../Files/StartSettings.ini';
        this.DEFAULT_FILE_SETTINGS_PATH = '/home/steam/PalworldServer/DefaultPalWorldSettings.ini';
        this.SERVER_SETTINGS_FILE_PATH = '/home/steam/PalworldServer/Pal/Saved/Config/LinuxServer/PalWorldSettings.ini';
        this.SERVER_SETTINGS_DIR = '/home/steam/PalworldServer/Pal/Saved/Config/LinuxServer';
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
        this.PALWORLD_GAME_FILES = "/home/steam/PalworldServer/Pal/Saved";
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
