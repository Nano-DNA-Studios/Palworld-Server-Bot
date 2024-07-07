"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const discord_js_1 = require("discord.js");
const SCPInfo_1 = __importDefault(require("./PalworldServer/Objects/SCPInfo"));
const AnnouncementMessage_1 = __importDefault(require("./PalworldServer/Objects/AnnouncementMessage"));
const fs_1 = __importDefault(require("fs"));
class PalworldServerBotDataManager extends dna_discord_framework_1.BotDataManager {
    constructor() {
        super(...arguments);
        this.SERVER_PATH = '/home/steam/PalworldServer';
        this.START_SETTINGS_FILE_PATH = '../PalworldServer/Files/StartSettings.ini';
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
    async CreateBackup() {
        try {
            const now = new Date();
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');
            const min = String(now.getMinutes()).padStart(2, '0');
            let timestamp = `${year}_${month}_${day}_${hour}_${min}`;
            const backupFilePath = "/home/steam/Backups/WorldBackup.tar.gz";
            let runner = new dna_discord_framework_1.BashScriptRunner();
            await runner.RunLocally(`cd ${this.PALWORLD_GAME_FILES} && cd .. && tar -czvf ${backupFilePath} Saved/*`);
            if (!fs_1.default.existsSync("/home/steam/Backups/Extras"))
                fs_1.default.mkdirSync("/home/steam/Backups/Extras", { recursive: true });
            await runner.RunLocally(`cp ${backupFilePath} /home/steam/Backups/Extras/WorldBackup_${timestamp}.tar.gz`);
            new AnnouncementMessage_1.default("World has been Backed up Successfully").GetRequest().SendRequest();
        }
        catch (error) {
            try {
                new AnnouncementMessage_1.default("Error Creating Backup").GetRequest().SendRequest();
            }
            catch (error) {
                console.log("Error Creating Backup");
            }
        }
    }
}
exports.default = PalworldServerBotDataManager;
