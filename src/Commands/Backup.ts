import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import fsp from "fs/promises";
import fs from "fs";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";
import SCPInfo from "../PalworldServer/Objects/SCPInfo";

class Backup extends Command {

    public CommandName: string = "backup";

    public CommandDescription: string = "Makes a Backup of the Palworld World";

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, `Creating Backup of World`);

        const dataManager = BotData.Instance(PalworldServerBotDataManager);

        const backupFilePath = "/home/steam/Backups/WorldBackup.tar.gz";

        await dataManager.CreateBackup();

        const fileStats = await fsp.stat(backupFilePath);
        const sizeAndFormat = this.GetFileSize(fileStats);

        this.AddToResponseMessage("Backup File Created Successfully");

        try {
            await PalworldRestfulCommands.UpdateServerMetrics(client);

            if (sizeAndFormat[0] > this.MAX_FILE_SIZE_MB && sizeAndFormat[1] == "MB") {
                console.log("File is too large, Download it using the following Command in your Terminal");
                let scpInfoState = this.IsSCPInfoUndefined(dataManager);

                if (scpInfoState) {
                    console.log("SCP Information is not defined. Register the Information using /registerbackup");
                    this.AddToResponseMessage("SCP Information is not defined. Register the Information using /registerbackup")
                    return
                }

                this.AddToResponseMessage("File is too large, Download it using the following Command in your Terminal")
                let command = `scp -P ${dataManager.SCP_INFO.Port} ${dataManager.SCP_INFO.User}@${dataManager.SCP_INFO.HostName}:"${dataManager.SCP_INFO.HostDeviceBackupFolder}/WorldBackup.tar.gz" "${dataManager.SCP_INFO.DownloadLocation}"`;
                command = "```" + command + "```"
                this.AddToResponseMessage(command)
            } else {
                console.log("Uploading Backup File to Discord");
                this.AddToResponseMessage("Uploading Backup File to Discord.");
                this.AddFileToResponseMessage(backupFilePath);
            }
        } catch (error) {
            this.AddToResponseMessage("Error Doing Something");
            console.log("Error Doing Something");
            console.log(error);
            return;
        }
    };

    IsSCPInfoUndefined(dataManager: PalworldServerBotDataManager) : boolean{
        let SCP = new SCPInfo(dataManager.SCP_INFO);

        return SCP.IsUndefined();
    }

    public IsEphemeralResponse: boolean = true;

    private MAX_FILE_SIZE_MB: Number = 20;

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