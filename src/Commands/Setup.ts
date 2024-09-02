import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import PalworldServerSettingsEnum from "../PalworldServer/Enums/PalworldServerSettingsEnum";
import ServerSettingsManager from "../PalworldServer/ServerSettingsManager";

class Setup extends Command {

    CommandName: string = 'setup';

    CommandDescription: string = 'Sets up the Server for the First Time';

    public IsCommandBlocking: boolean = false;

    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        const DataManager = BotData.Instance(PalworldServerBotDataManager)
        const serverName = interaction.options.getString('servername');
        const serverDesc = interaction.options.getString('serverdescription');
        const adminPassword = interaction.options.getString('adminpassword');
        const connection = interaction.options.getString('connection');

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

            if (connection) 
                DataManager.SERVER_CONNECTION_PORT = connection;
            
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
            name: 'connection',
            description: 'The Connection String to join the Server',
            required: true,
            type: OptionTypesEnum.String
        }
    ];
}

export = Setup;