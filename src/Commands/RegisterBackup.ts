import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import SCPInfo from "../PalworldServer/Objects/SCPInfo";

class RegisterBackup extends Command {

    public CommandName: string = "registerbackup";

    public CommandDescription: string = "Registers the SCP Info to get the Backup file if it's too large";

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, `Registering SCP Info`);

        const dataManager = BotData.Instance(PalworldServerBotDataManager)

        const user = interaction.options.getString('user');
        const hostname = interaction.options.getString('hostname');
        const port = interaction.options.getNumber('port');
        const hostdevicebackupfolder = interaction.options.getString('hostdevicebackupfolder');
        const downloadlocation = interaction.options.getString('downloadlocation');

        if (user && hostname && port && hostdevicebackupfolder && downloadlocation) {

            let scpInfo = new SCPInfo(port, user, hostname, hostdevicebackupfolder, downloadlocation);

            dataManager.SCP_INFO = scpInfo;

            this.AddToResponseMessage("SCP Info Registered");
        } else
            this.AddToResponseMessage("Error Registering SCP Info");

    };

    public IsEphemeralResponse: boolean = true;

    public Options?: ICommandOption[] = [
        {
            name: 'user',
            description: 'The User on the Server to SCP the File',
            required: true,
            type: OptionTypesEnum.String
        },
        {
            name: 'hostname',
            description: 'The Hostname on the Server to SCP the File, often the IP Address (After the @ symbol on Linux)',
            required: true,
            type: OptionTypesEnum.String
        },
        {
            name: 'port',
            description: 'The Port to SSH into the Server',
            required: true,
            type: OptionTypesEnum.Number
        },
        {
            name: 'hostdevicebackupfolder',
            description: 'The Folder on the Host Device where the Backup is Stored/Mirrored through Docker Volumes',
            required: true,
            type: OptionTypesEnum.String
        },
        {
            name: 'downloadlocation',
            description: 'The Location on your Personal Device you want to Download the Backup to',
            required: true,
            type: OptionTypesEnum.String
        }
    ];
}

export = RegisterBackup;