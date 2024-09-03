"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
const PalworldServerSettingsEnum_1 = __importDefault(require("../PalworldServer/Enums/PalworldServerSettingsEnum"));
const ServerSettingsManager_1 = __importDefault(require("../PalworldServer/ServerSettingsManager"));
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
class Setup extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'setup';
        this.CommandDescription = 'Sets up the Server for the First Time';
        this.IsCommandBlocking = true;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            const DataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            const serverName = interaction.options.getString('servername');
            const serverDesc = interaction.options.getString('serverdescription');
            const adminPassword = interaction.options.getString('adminpassword');
            const serverPort = interaction.options.getString('serverport');
            const restfulPort = interaction.options.getString('restfulport');
            this.InitializeUserResponse(interaction, `Changing Default Settings`);
            let serverSetting = new ServerSettingsManager_1.default();
            try {
                if (serverName) {
                    DataManager.SERVER_NAME = serverName;
                    serverSetting.SetStringSettingValue(PalworldServerSettingsEnum_1.default.ServerName, serverName);
                }
                if (serverDesc) {
                    DataManager.SERVER_DESCRIPTION = serverDesc;
                    serverSetting.SetStringSettingValue(PalworldServerSettingsEnum_1.default.ServerDescription, serverDesc);
                }
                if (adminPassword) {
                    DataManager.SERVER_ADMIN_PASSWORD = adminPassword;
                    serverSetting.SetStringSettingValue(PalworldServerSettingsEnum_1.default.AdminPassword, adminPassword);
                }
                if (serverPort)
                    DataManager.SERVER_PUBLIC_PORT = parseInt(serverPort);
                if (restfulPort)
                    DataManager.RESTFUL_PUBLIC_PORT = parseInt(restfulPort);
                serverSetting.SetStringSettingValue(PalworldServerSettingsEnum_1.default.PublicPort, DataManager.SERVER_PORT.toString());
                serverSetting.SetStringSettingValue(PalworldServerSettingsEnum_1.default.RESTAPIEnabled, "True");
                serverSetting.SetStringSettingValue(PalworldServerSettingsEnum_1.default.RESTAPIPort, DataManager.RESTFUL_PORT.toString());
                serverSetting.SaveSettings();
                this.AddToResponseMessage("Settings Updated!");
                DataManager.ServerLoadedOrSetup();
                this.AddToResponseMessage("Server Setup Complete, You can now Start the Server using /start");
            }
            catch (error) {
                this.AddToResponseMessage("Error Changing Settings");
                return;
            }
            await PalworldRestfulCommands_1.default.UpdateServerInfo(client);
        };
        this.IsEphemeralResponse = true;
        this.Options = [
            {
                name: 'servername',
                description: 'The Name of the Server',
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String
            },
            {
                name: 'serverdescription',
                description: 'The Description for the Server',
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String
            },
            {
                name: 'adminpassword',
                description: 'The Admin Password for the Server',
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String
            },
            {
                name: 'serverport',
                description: 'The Port on which the Server is Exposed. Connect to this Port to Join the Server',
                required: false,
                type: dna_discord_framework_1.OptionTypesEnum.String
            },
            {
                name: 'restfulport',
                description: 'The Port on which the Server is Exposed. Connect to this Port to Join the Server',
                required: false,
                type: dna_discord_framework_1.OptionTypesEnum.String
            }
        ];
    }
}
module.exports = Setup;
