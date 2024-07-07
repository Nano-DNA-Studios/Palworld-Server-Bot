"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
const ServerSettingsEnum_1 = __importDefault(require("../Options/ServerSettingsEnum"));
const ServerSettingsManager_1 = __importDefault(require("../ServerManagement/ServerSettingsManager"));
class Setup extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'setup';
        this.CommandDescription = 'Sets up the Server for the First Time';
        this.Section = '/Script/Pal';
        this.PalGameWorldSettings = 'PalGameWorldSettings';
        this.OptionSettings = 'OptionSettings';
        this.Settings = '';
        this.ServerSettingsArray = [];
        this.RunCommand = async (client, interaction, BotDataManager) => {
            const DataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            const serverName = interaction.options.getString('servername');
            const serverDesc = interaction.options.getString('serverdescription');
            const adminPassword = interaction.options.getString('adminpassword');
            this.InitializeUserResponse(interaction, `Changing Default Settings`);
            let serverSetting = new ServerSettingsManager_1.default();
            try {
                if (serverName) {
                    DataManager.SERVER_NAME = serverName;
                    serverSetting.SetSettingValue(ServerSettingsEnum_1.default.ServerName, serverName);
                }
                if (serverDesc) {
                    DataManager.SERVER_DESCRIPTION = serverDesc;
                    serverSetting.SetSettingValue(ServerSettingsEnum_1.default.ServerDescription, serverDesc);
                }
                if (adminPassword) {
                    DataManager.SERVER_ADMIN_PASSWORD = adminPassword;
                    serverSetting.SetSettingValue(ServerSettingsEnum_1.default.AdminPassword, adminPassword);
                }
                serverSetting.SetSettingValue(ServerSettingsEnum_1.default.PublicPort, DataManager.SERVER_PORT.toString());
                serverSetting.SetSettingValue(ServerSettingsEnum_1.default.RESTAPIEnabled, "True");
                serverSetting.SetSettingValue(ServerSettingsEnum_1.default.RESTAPIPort, DataManager.RESTFUL_PORT.toString());
                serverSetting.SaveSettings();
                this.AddToResponseMessage("Settings Updated!");
            }
            catch (error) {
                this.AddToResponseMessage("Error Changing Settings");
                return;
            }
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
            }
        ];
    }
}
module.exports = Setup;
