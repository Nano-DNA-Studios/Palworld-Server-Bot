"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
const SCPInfo_1 = __importDefault(require("../PalworldServer/Objects/SCPInfo"));
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
class RegisterBackup extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "registerbackup";
        this.CommandDescription = "Registers the SCP Info to get the Backup file if it's too large";
        this.IsCommandBlocking = false;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            this.InitializeUserResponse(interaction, `Registering SCP Info`);
            const dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            const user = interaction.options.getString('user');
            const hostname = interaction.options.getString('hostname');
            const port = interaction.options.getNumber('port');
            const hostdevicebackupfolder = interaction.options.getString('hostdevicebackupfolder');
            const downloadlocation = interaction.options.getString('downloadlocation');
            if (user && hostname && port && hostdevicebackupfolder && downloadlocation) {
                let scpInfo = new SCPInfo_1.default({
                    Port: port,
                    User: user,
                    HostName: hostname,
                    HostDeviceBackupFolder: hostdevicebackupfolder,
                    DownloadLocation: downloadlocation
                });
                dataManager.SCP_INFO = scpInfo;
                dataManager.SaveData();
                this.AddToResponseMessage("SCP Info Registered");
            }
            else
                this.AddToResponseMessage("Error Registering SCP Info");
            await PalworldRestfulCommands_1.default.UpdateServerInfo(client);
        };
        this.IsEphemeralResponse = true;
        this.Options = [
            {
                name: 'user',
                description: 'The User on the Server to SCP the File',
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String
            },
            {
                name: 'hostname',
                description: 'The Hostname on the Server to SCP the File, often the IP Address (After the @ symbol on Linux)',
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String
            },
            {
                name: 'port',
                description: 'The Port to SSH into the Server',
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.Number
            },
            {
                name: 'hostdevicebackupfolder',
                description: 'The Folder on the Host Device where the Backup is Stored/Mirrored through Docker Volumes',
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String
            },
            {
                name: 'downloadlocation',
                description: 'The Location on your Personal Device you want to Download the Backup to',
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String
            }
        ];
    }
}
module.exports = RegisterBackup;
