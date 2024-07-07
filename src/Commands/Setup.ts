import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import * as fs from 'fs';
import * as ini from 'ini';
import * as path from 'path';
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import ServerSettingsEnum from "../Options/ServerSettingsEnum";
import ServerSettingsManager from "../ServerManagement/ServerSettingsManager";
import { server } from "typescript";


class Setup extends Command {

    CommandName: string = 'setup';

    CommandDescription: string = 'Sets up the Server for the First Time';

    public Section: string = '/Script/Pal';

    public PalGameWorldSettings: string = 'PalGameWorldSettings';

    public OptionSettings: string = 'OptionSettings';

    public ConfigFile: any;

    public Settings: string = '';

    public ServerSettingsArray: string[] = [];

    RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        const DataManager = BotData.Instance(PalworldServerBotDataManager)
        const serverName = interaction.options.getString('servername');
        const serverDesc = interaction.options.getString('serverdescription');
        const adminPassword = interaction.options.getString('adminpassword');

        this.InitializeUserResponse(interaction, `Changing Default Settings`)

        let serverSetting = new ServerSettingsManager();

        try {
            
            if (serverName) {
                DataManager.SERVER_NAME = serverName;
                serverSetting.SetSettingValue(ServerSettingsEnum.ServerName, serverName);
            }

            if (serverDesc) {
                DataManager.SERVER_DESCRIPTION = serverDesc;
                serverSetting.SetSettingValue(ServerSettingsEnum.ServerDescription, serverDesc);
            }

            if (adminPassword) {
                DataManager.SERVER_ADMIN_PASSWORD = adminPassword;
                serverSetting.SetSettingValue(ServerSettingsEnum.AdminPassword, adminPassword);
            }

            serverSetting.SetSettingValue(ServerSettingsEnum.PublicPort, DataManager.SERVER_PORT.toString());
            serverSetting.SetSettingValue(ServerSettingsEnum.RESTAPIEnabled, "True");
            serverSetting.SetSettingValue(ServerSettingsEnum.RESTAPIPort, DataManager.RESTFUL_PORT.toString());

            serverSetting.SaveSettings();

            this.AddToResponseMessage("Settings Updated!")

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
        }
    ];
}

export = Setup;