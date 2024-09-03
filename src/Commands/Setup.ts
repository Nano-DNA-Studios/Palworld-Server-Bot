import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import PalworldServerSettingsEnum from "../PalworldServer/Enums/PalworldServerSettingsEnum";
import ServerSettingsManager from "../PalworldServer/ServerSettingsManager";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";

class Setup extends Command {

    CommandName: string = 'setup';

    CommandDescription: string = 'Sets up the Server for the First Time';

    public IsCommandBlocking: boolean = true;

    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        const DataManager = BotData.Instance(PalworldServerBotDataManager)
        const serverName = interaction.options.getString('servername');
        const serverDesc = interaction.options.getString('serverdescription');
        const adminPassword = interaction.options.getString('adminpassword');
        const serverPort = interaction.options.getString('serverport');
        const restfulPort = interaction.options.getString('restfulport');

        this.InitializeUserResponse(interaction, `Changing Default Settings`)

        let serverSetting = new ServerSettingsManager();

        try {

            if (serverName) {
                DataManager.SERVER_NAME = serverName;
                serverSetting.SetStringSettingValue(PalworldServerSettingsEnum.ServerName, serverName);
            }

            if (serverDesc) {
                DataManager.SERVER_DESCRIPTION = serverDesc;
                serverSetting.SetStringSettingValue(PalworldServerSettingsEnum.ServerDescription, serverDesc);
            }

            if (adminPassword) {
                DataManager.SERVER_ADMIN_PASSWORD = adminPassword;
                serverSetting.SetStringSettingValue(PalworldServerSettingsEnum.AdminPassword, adminPassword);
            }

            if (serverPort) 
                DataManager.SERVER_PUBLIC_PORT = parseInt(serverPort);
            

            if (restfulPort) 
                DataManager.RESTFUL_PUBLIC_PORT = parseInt(restfulPort);
            
            serverSetting.SetStringSettingValue(PalworldServerSettingsEnum.PublicPort, DataManager.SERVER_PORT.toString());
            serverSetting.SetStringSettingValue(PalworldServerSettingsEnum.RESTAPIEnabled, "True");
            serverSetting.SetStringSettingValue(PalworldServerSettingsEnum.RESTAPIPort, DataManager.RESTFUL_PORT.toString());

            serverSetting.SaveSettings();

            this.AddToResponseMessage("Settings Updated!")

            DataManager.ServerLoadedOrSetup();

            this.AddToResponseMessage("Server Setup Complete, You can now Start the Server using /start")

        } catch (error) {
            this.AddToResponseMessage("Error Changing Settings")
            return;
        }

        await PalworldRestfulCommands.UpdateServerInfo(client);
    };

    public IsEphemeralResponse: boolean = true;

    public Options?: ICommandOption[] = [
        {
            name: 'servername',
            description: 'The Name of the Server',
            required: true,
            type: OptionTypesEnum.String
        },
        {
            name: 'serverdescription',
            description: 'The Description for the Server',
            required: true,
            type: OptionTypesEnum.String
        },
        {
            name: 'adminpassword',
            description: 'The Admin Password for the Server',
            required: true,
            type: OptionTypesEnum.String
        },
        {
            name: 'serverport',
            description: 'The Public Port on which the Server is Exposed. Connect to this Port to Join the Server',
            required: false,
            type: OptionTypesEnum.String
        },
        {
            name: 'restfulport',
            description: 'The Public Port on which the RESTFUL Server is Exposed. Connect to this Port to connect to RCON',
            required: false,
            type: OptionTypesEnum.String
        }
    ];
}

export = Setup;