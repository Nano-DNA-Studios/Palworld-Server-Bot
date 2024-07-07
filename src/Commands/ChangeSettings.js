"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const ServerSettingsEnum_1 = __importDefault(require("../Options/ServerSettingsEnum"));
const ServerSettingsManager_1 = __importDefault(require("../ServerManagement/ServerSettingsManager"));
class ChangeSettings extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "changesettings";
        this.CommandDescription = "Changes one of the Server Settings";
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let settingName = interaction.options.getString('setting');
            let settingValue = interaction.options.getString('value');
            this.InitializeUserResponse(interaction, `Changing Server Setting`);
            if (settingName && settingValue) {
                let serverSettingsManager = new ServerSettingsManager_1.default();
                let serverSetting = serverSettingsManager.getEnum(settingName);
                if (serverSetting != ServerSettingsEnum_1.default.None) {
                    serverSettingsManager.SetSettingValue(serverSetting, settingValue);
                    serverSettingsManager.SaveSettings();
                    this.AddToResponseMessage(`Setting ${settingName} Changed to ${settingValue} (Server Must be Restarted for Changes to Take Effect)`);
                }
                else {
                    this.AddToResponseMessage(`Setting ${settingName} Not Found`);
                }
            }
            else
                this.AddToResponseMessage("Error Changing Server Setting, Please Provide a Setting and Value");
        };
        this.IsEphemeralResponse = true;
        this.Options = [
            {
                name: 'setting',
                description: 'The Setting to Change',
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String,
                choices: [
                    {
                        name: ServerSettingsEnum_1.default.DayTimeSpeedRate,
                        value: ServerSettingsEnum_1.default.DayTimeSpeedRate
                    },
                    {
                        name: ServerSettingsEnum_1.default.NightTimeSpeedRate,
                        value: ServerSettingsEnum_1.default.NightTimeSpeedRate
                    },
                    {
                        name: ServerSettingsEnum_1.default.ExpRate,
                        value: ServerSettingsEnum_1.default.ExpRate
                    },
                    {
                        name: ServerSettingsEnum_1.default.PalCaptureRate,
                        value: ServerSettingsEnum_1.default.PalCaptureRate
                    },
                    {
                        name: ServerSettingsEnum_1.default.PalSpawnNumRate,
                        value: ServerSettingsEnum_1.default.PalSpawnNumRate
                    },
                    {
                        name: ServerSettingsEnum_1.default.PalCaptureRate,
                        value: ServerSettingsEnum_1.default.PalCaptureRate
                    },
                    {
                        name: ServerSettingsEnum_1.default.PlayerAutoHPRegeneRate,
                        value: ServerSettingsEnum_1.default.PlayerAutoHPRegeneRate
                    },
                    {
                        name: ServerSettingsEnum_1.default.PalAutoHPRegeneRate,
                        value: ServerSettingsEnum_1.default.PalAutoHPRegeneRate
                    },
                    {
                        name: ServerSettingsEnum_1.default.PlayerAutoHPRegeneRate,
                        value: ServerSettingsEnum_1.default.PlayerAutoHPRegeneRate
                    },
                    {
                        name: ServerSettingsEnum_1.default.CollectionDropRate,
                        value: ServerSettingsEnum_1.default.CollectionDropRate
                    },
                    {
                        name: ServerSettingsEnum_1.default.CollectionObjectRespawnSpeedRate,
                        value: ServerSettingsEnum_1.default.CollectionObjectRespawnSpeedRate
                    },
                    {
                        name: ServerSettingsEnum_1.default.PalEggDefaultHatchingTime,
                        value: ServerSettingsEnum_1.default.PalEggDefaultHatchingTime
                    },
                ]
            },
            {
                name: 'value',
                description: 'The Value to Change the Setting to',
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String,
                choices: [
                    {
                        name: "0.1",
                        value: "0.100000"
                    },
                    {
                        name: "0.2",
                        value: "0.200000"
                    },
                    {
                        name: "0.25",
                        value: "0.250000"
                    },
                    {
                        name: "0.5",
                        value: "0.500000"
                    },
                    {
                        name: "0.75",
                        value: "0.750000"
                    },
                    {
                        name: "1",
                        value: "1.000000"
                    },
                    {
                        name: "1.1",
                        value: "1.100000"
                    },
                    {
                        name: "1.25",
                        value: "1.250000"
                    },
                    {
                        name: "1.5",
                        value: "1.500000"
                    },
                    {
                        name: "1.75",
                        value: "1.750000"
                    },
                    {
                        name: "2",
                        value: "2.000000"
                    },
                    {
                        name: "2.25",
                        value: "2.250000"
                    },
                    {
                        name: "2.5",
                        value: "2.500000"
                    },
                    {
                        name: "2.75",
                        value: "2.750000"
                    },
                    {
                        name: "3",
                        value: "3.000000"
                    },
                    {
                        name: "4",
                        value: "4.000000"
                    },
                    {
                        name: "5",
                        value: "5.000000"
                    },
                ]
            }
        ];
    }
}
module.exports = ChangeSettings;
