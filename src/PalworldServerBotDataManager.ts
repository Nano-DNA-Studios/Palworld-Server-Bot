import { BashScriptRunner, BotDataManager } from "dna-discord-framework";
import ServerMetrics from "./PalworldServer/Objects/ServerMetrics";
import { Client, ActivityType } from "discord.js";
import SCPInfo from "./PalworldServer/Objects/SCPInfo";
import AnnouncementMessage from "./PalworldServer/Objects/AnnouncementMessage";
import fs from 'fs';
import axios from "axios";
import PalworldRestfulCommands from "./PalworldServer/RESTFUL/PalworldRestfulCommands";

class PalworldServerBotDataManager extends BotDataManager {

    SERVER_PATH: string = '/home/steam/PalworldServer';

    START_SETTINGS_FILE_PATH = '../PalworldServer/Files/StartSettings.ini'

    DEFAULT_FILE_SETTINGS_PATH = `${this.SERVER_PATH}/DefaultPalWorldSettings.ini`

    SERVER_SETTINGS_FILE_PATH = `${this.SERVER_PATH}/Pal/Saved/Config/LinuxServer/PalWorldSettings.ini`

    SERVER_SETTINGS_DIR = `${this.SERVER_PATH}/Pal/Saved/Config/LinuxServer`

    SERVER_START_SCRIPT = "PalServer.sh";

    SERVER_PROCESS_NAME = "PalServer-Linux-Test";

    SERVER_PORT = 8211;

    RESTFUL_PORT = 8212;

    RESTFUL_HOSTNAME = 'localhost';

    RESTFUL_GET_METHOD = 'GET';

    RESTFUL_POST_METHOD = 'POST';

    SERVER_ADMIN_PASSWORD: string = '';

    SERVER_NAME: string = '';

    SERVER_DESCRIPTION: string = '';

    PALWORLD_GAME_FILES = `${this.SERVER_PATH}/Pal/Saved`

    PALWORLD_SERVER_FILES = `${this.SERVER_PATH}/Pal/`

    SCP_INFO: SCPInfo = new SCPInfo();

    LAST_BACKUP_DATE: Date = new Date();

    LAST_SHUTDOWN_DATE: Date = new Date();

    SERVER_CONNECTION_PORT: string = 'localhost:8211';

    UPDATE_SCRIPT: string = "steamcmd +force_install_dir /home/steam/PalworldServer/ +login anonymous +app_update 2394010 validate +quit"

    SERVER_READY_TO_START: boolean = false;

    constructor ()
    {
        super();

        this.SERVER_READY_TO_START = false;
    }

    public UpdateMetricsStatus(metrics: ServerMetrics, client: Client): void {
        let message = `Palworld Server : Players Online: ${metrics.PlayerNum} \nServer Uptime: ${metrics.GetUptime()} \nTime Since Last Backup: ${this.GetTimeSinceLastBackup()}`;

        if (client.user) {
            if (metrics.Uptime == 0 || metrics.Uptime == undefined)
                client.user.setActivity("Server Offline", { type: ActivityType.Playing });
            else
                client.user.setActivity(message, { type: ActivityType.Playing });
        }

        this.UpdateConnectionInfo();
    }

    public GetTimeSinceLastBackup = (): string => {
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
        if (hours > 0 || days > 0) {  // Include hours if days are also present
            result += `${hours} h : `;
        }
        if (minutes > 0 || hours > 0 || days > 0) {  // Include minutes if hours or days are present
            result += `${minutes} min :`;
        }
        if (minutes > 0 || hours > 0 || days > 0 || seconds > 0) { // Include minutes if hours or days are present
            result += ` ${seconds} sec`;
        }

        return result;
    }

    public async CreateBackup(depth: number = 0): Promise<void> {
        let online = await PalworldRestfulCommands.IsServerOnline();
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
            let runner = new BashScriptRunner();

            await runner.RunLocally(`cd ${this.PALWORLD_GAME_FILES} && cd .. && tar -czvf ${backupFilePath} Saved/*`);

            if (!fs.existsSync("/home/steam/Backups/Extras"))
                fs.mkdirSync("/home/steam/Backups/Extras", { recursive: true });

            await runner.RunLocally(`cp ${backupFilePath} /home/steam/Backups/Extras/WorldBackup_${timestamp}.tar.gz`)

            if (online)
                new AnnouncementMessage("World has been Backed up Successfully").GetRequest().SendRequest();

        } catch (error) {

            if (online)
                new AnnouncementMessage("Error Creating Backup").GetRequest().SendRequest();

            if (depth > 3)
                return;

            console.log("Error Creating Backup, trying again");

            await this.CreateBackup(depth + 1);
        }
    }

    public async UpdateConnectionInfo(): Promise<void> {
        return this.GetPublicIp().then((ip) => {
            this.SERVER_CONNECTION_PORT = `${ip}:${this.SERVER_PORT}`;
        }
        ).catch((error) => {
            console.log("Error Getting Public IP")
        });
    }

    async GetPublicIp(): Promise<string> {
        try {
            const response = await axios.get('https://api.ipify.org?format=json');
            return response.data.ip;
        } catch (error) {
            console.error('Error fetching the public IP address:', error);
            throw error;
        }
    }

    public UpdateShutdownDate(): void {
        this.LAST_SHUTDOWN_DATE = new Date();
        this.SaveData();
    }

    public ServerLoadedOrSetup (): void
    {
        this.SERVER_READY_TO_START = true;
    }

    public ServerStartReset (): void
    {
        this.SERVER_READY_TO_START = false;
    }

    public IsServerSetup(): boolean {
        return this.SERVER_READY_TO_START;
    }

    public IsSafeToStartServer(): boolean {
        let now = new Date();
        let diff = (now.getTime() - new Date(this.LAST_SHUTDOWN_DATE).getTime()) / 1000;
        return diff > 120;
    }
}

export default PalworldServerBotDataManager;