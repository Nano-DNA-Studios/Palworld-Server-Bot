import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import GameWorldManager from "../GameWorldManagement/GameWorldManager";
import fsp from "fs/promises";
import fs from "fs";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class Backup extends Command {

    public CommandName: string = "backup";

    public CommandDescription: string = "Makes a Backup of the Palworld World";

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, `Creating Backup of World`);

        const dataManager = BotData.Instance(PalworldServerBotDataManager);

        const backupFilePath = "/home/steam/Backups/WorldBackup.tar.gz";

        GameWorldManager.CreateBackup();

        const fileStats = await fsp.stat(backupFilePath);
        const sizeAndFormat = this.GetFileSize(fileStats);

        if (sizeAndFormat[0] > this.MAX_FILE_SIZE_MB && sizeAndFormat[1] == "MB")
        {
            this.AddToResponseMessage("File is too large, Download it using the following Command in your Terminal")
            let  command = `scp -P ${dataManager.SCP_INFO.Port} ${dataManager.SCP_INFO.User}@${dataManager.SCP_INFO.HostName}:"${dataManager.SCP_INFO.HostDeviceBackupFolder}/WorldBackup.tar.gz" "${dataManager.SCP_INFO.DownloadLocation}"`;
            command = "```" + command + "```"
            this.AddToResponseMessage(command)
        } else
            this.AddFileToResponseMessage(backupFilePath);
    };

    public IsEphemeralResponse: boolean = true;

    private MAX_FILE_SIZE_MB : Number = 80;

    GetFileSize(fileStats: fs.Stats): [Number, string] {
        let realsize;
        let sizeFormat;

        if (fileStats.size / (1024 * 1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024 * 1024)) / 100;
            sizeFormat = "MB";
        } else if (fileStats.size / (1024) >= 1) {
            realsize = Math.floor(100 * fileStats.size / (1024)) / 100;
            sizeFormat = "KB";
        } else {
            realsize = fileStats.size;
            sizeFormat = "B";
        }

        return [realsize, sizeFormat];
    }
}

export = Backup;