"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const ServerMetrics_1 = __importDefault(require("./PalworldServer/Objects/ServerMetrics"));
const discord_js_1 = require("discord.js");
const SCPInfo_1 = __importDefault(require("./PalworldServer/Objects/SCPInfo"));
const AnnouncementMessage_1 = __importDefault(require("./PalworldServer/Objects/AnnouncementMessage"));
const fs_1 = __importDefault(require("fs"));
const axios_1 = __importDefault(require("axios"));
const PalworldRestfulCommands_1 = __importDefault(require("./PalworldServer/RESTFUL/PalworldRestfulCommands"));
const PlayerDatabase_1 = __importDefault(require("./BotData/PlayerDatabase"));
class PalworldServerBotDataManager extends dna_discord_framework_1.BotDataManager {
    constructor() {
        super();
        this.SERVER_PATH = '/home/steam/PalworldServer';
        this.START_SETTINGS_FILE_PATH = '../PalworldServer/Files/StartSettings.ini';
        this.DEFAULT_FILE_SETTINGS_PATH = `${this.SERVER_PATH}/DefaultPalWorldSettings.ini`;
        this.SERVER_SETTINGS_FILE_PATH = `${this.SERVER_PATH}/Pal/Saved/Config/LinuxServer/PalWorldSettings.ini`;
        this.SERVER_SETTINGS_DIR = `${this.SERVER_PATH}/Pal/Saved/Config/LinuxServer`;
        this.SERVER_START_SCRIPT = "PalServer.sh";
        this.SERVER_PROCESS_NAME = "PalServer-Linux-Test";
        this.SERVER_PUBLIC_PORT = 8211;
        this.RESTFUL_PUBLIC_PORT = 8212;
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
        this.BACKUPS_DIR = '/home/steam/Backups';
        this.EXTRA_BACKUPS_DIR = '/home/steam/Backups/Extras';
        this.SCP_INFO = new SCPInfo_1.default();
        this.LAST_BACKUP_DATE = new Date();
        this.LAST_SHUTDOWN_DATE = new Date();
        this.SERVER_CONNECTION_PORT = 'localhost:8211';
        this.UPDATE_SCRIPT = "steamcmd +force_install_dir /home/steam/PalworldServer/ +login anonymous +app_update 2394010 validate +quit";
        this.SERVER_READY_TO_START = false;
        this.PLAYER_DATABASE = new PlayerDatabase_1.default();
        this.SERVER_METRICS = ServerMetrics_1.default.DefaultMetrics();
        this.MAX_BACKUP_FILES = 5;
        //let message = `Palworld Server \nPlayers Online: ${metrics.PlayerNum} \nServer Uptime: ${metrics.GetUptime()} \nTime Since Last Backup: ${this.GetTimeSinceLastBackup()}`;
        this.GetTimeSinceLastBackup = () => {
            let lastTime = this.LAST_BACKUP_DATE;
            if (!(lastTime instanceof Date)) {
                this.LAST_BACKUP_DATE = new Date();
                lastTime = this.LAST_BACKUP_DATE;
            }
            let uptime = (new Date().getTime() - lastTime.getTime()) / 1000;
            const days = Math.floor(uptime / 86400);
            const hours = Math.floor((uptime % 86400) / 3600);
            const minutes = Math.floor((uptime % 3600) / 60);
            const seconds = Math.floor(uptime % 60);
            let result = "";
            if (days > 0) {
                result += `${days} d : `;
            }
            if (hours > 0 || days > 0) { // Include hours if days are also present
                result += `${hours} h : `;
            }
            if (minutes > 0 || hours > 0 || days > 0) { // Include minutes if hours or days are present
                result += `${minutes} min :`;
            }
            if (minutes > 0 || hours > 0 || days > 0 || seconds > 0) { // Include minutes if hours or days are present
                result += ` ${seconds} sec`;
            }
            return result;
        };
        this.SERVER_READY_TO_START = false;
    }
    GetOldestBackupFile() {
        let files = fs_1.default.readdirSync(this.EXTRA_BACKUPS_DIR);
        if (files.length == 0)
            return "";
        files = files.map(filename => {
            const filePath = `${this.EXTRA_BACKUPS_DIR}/${filename}`;
            return {
                name: filename,
                time: fs_1.default.statSync(filePath).mtime.getTime()
            };
        }).sort((a, b) => a.time - b.time) // Sort files from oldest to newest
            .map(file => file.name);
        return files[0];
    }
    ManageBackupFiles() {
        let maxLoop = 0;
        while (fs_1.default.readdirSync(this.EXTRA_BACKUPS_DIR).length > this.MAX_BACKUP_FILES && maxLoop < 50) {
            maxLoop++;
            let oldestFile = this.GetOldestBackupFile();
            if (oldestFile != "")
                fs_1.default.rmSync(`${this.EXTRA_BACKUPS_DIR}/${oldestFile}`);
        }
    }
    async CreateBackup(depth = 0) {
        let online = await PalworldRestfulCommands_1.default.IsServerOnline();
        try {
            const now = new Date();
            this.LAST_BACKUP_DATE = now;
            const year = now.getFullYear();
            const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based, so add 1
            const day = String(now.getDate()).padStart(2, '0');
            const hour = String(now.getHours()).padStart(2, '0');
            const min = String(now.getMinutes()).padStart(2, '0');
            let timestamp = `${year}_${month}_${day}_${hour}_${min}`;
            const backupFilePath = "/home/steam/Backups/WorldBackup.tar.gz";
            let runner = new dna_discord_framework_1.BashScriptRunner();
            await runner.RunLocally(`cd ${this.PALWORLD_GAME_FILES} && cd .. && tar -czvf ${backupFilePath} Saved/*`);
            if (!fs_1.default.existsSync(this.EXTRA_BACKUPS_DIR))
                fs_1.default.mkdirSync(this.EXTRA_BACKUPS_DIR, { recursive: true });
            await runner.RunLocally(`cp ${backupFilePath} ${this.EXTRA_BACKUPS_DIR}/WorldBackup_${timestamp}.tar.gz`);
            this.ManageBackupFiles();
            if (online)
                new AnnouncementMessage_1.default("World has been Backed up Successfully").GetRequest().SendRequest();
        }
        catch (error) {
            if (online)
                new AnnouncementMessage_1.default("Error Creating Backup").GetRequest().SendRequest();
            if (depth > 3)
                return;
            console.log("Error Creating Backup, trying again");
            await this.CreateBackup(depth + 1);
        }
    }
    async UpdateConnectionInfo() {
        return this.GetPublicIp().then((ip) => {
            this.SERVER_CONNECTION_PORT = `${ip}:${this.SERVER_PUBLIC_PORT}`;
        }).catch((error) => {
            console.log("Error Getting Public IP");
        });
    }
    async GetPublicIp() {
        try {
            const response = await axios_1.default.get('https://api.ipify.org?format=json');
            return response.data.ip;
        }
        catch (error) {
            console.error('Error fetching the public IP address:', error);
            throw error;
        }
    }
    UpdateShutdownDate() {
        this.LAST_SHUTDOWN_DATE = new Date();
        this.SaveData();
    }
    ServerLoadedOrSetup() {
        this.SERVER_READY_TO_START = true;
    }
    ServerStartReset() {
        this.SERVER_READY_TO_START = false;
    }
    IsServerSetup() {
        return this.SERVER_READY_TO_START;
    }
    IsSafeToStartServer() {
        let now = new Date();
        let diff = (now.getTime() - new Date(this.LAST_SHUTDOWN_DATE).getTime()) / 1000;
        return diff > 120;
    }
    OfflineActivity(client) {
        if (client.user) {
            if (this.IsServerSetup())
                client.user.setActivity("Waiting for Server to Start", { type: discord_js_1.ActivityType.Custom });
            else
                client.user.setActivity("Waiting for Server Setup or Loaded Backup", { type: discord_js_1.ActivityType.Custom });
        }
    }
    OnlineActivity(client) {
        if (client.user) {
            client.user.setActivity("Palworld Server", { type: discord_js_1.ActivityType.Playing });
        }
    }
}
exports.default = PalworldServerBotDataManager;
