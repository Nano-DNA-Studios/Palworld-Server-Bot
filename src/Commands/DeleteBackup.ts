import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command } from "dna-discord-framework";
import fs from "fs";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class DeleteBackup extends Command {

    public CommandName: string = "deletebackup";

    public CommandDescription: string = "Deletes the Current Backup File on the Server to be Replaced with a New One.";

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        const dataManager = BotData.Instance(PalworldServerBotDataManager);

        if (fs.existsSync("/home/steam/Backups/WorldBackup.tar.gz")) {

            this.InitializeUserResponse(interaction, `Removing Backup File from Server`);

            try {
                let runner = new BashScriptRunner();

                runner.RunLocally(`rm -rf /home/steam/Backups/WorldBackup.tar.gz`)

                this.AddToResponseMessage("Backup File Removed Successfully");
            } catch (error) {
                this.AddToResponseMessage("Could not Remove Backup File from Server.");
            }
           
        } else 
            this.InitializeUserResponse(interaction, `No Backup File Found on Server.`);
        

        this.AddToResponseMessage("Please Provide a Backup File to Load in the /loadbackup Command.");

        this.AddToResponseMessage("If the Backup is too large, send it using the following Command in your Terminal. (May need to remove .gz from the file name)")

        let command = `scp -P ${dataManager.SCP_INFO.Port} "${dataManager.SCP_INFO.DownloadLocation}/WorldBackup.tar.gz" ${dataManager.SCP_INFO.User}@${dataManager.SCP_INFO.HostName}:"${dataManager.SCP_INFO.HostDeviceBackupFolder}"`;

        command = "```" + command + "```"

        this.AddToResponseMessage(command)

    };

    public IsEphemeralResponse: boolean = true;

}

export = DeleteBackup;