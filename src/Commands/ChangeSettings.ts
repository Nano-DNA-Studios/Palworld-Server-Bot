import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import ServerSettingsEnum from "../Options/ServerSettingsEnum";
import ServerSettingsManager from "../ServerManagement/ServerSettingsManager";

class ChangeSettings extends Command {

    public CommandName: string = "changesettings";

    public CommandDescription: string = "Changes one of the Server Settings";

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        let settingName = interaction.options.getString('setting');
        let settingValue = interaction.options.getString('value');

        this.InitializeUserResponse(interaction, `Changing Server Setting`);

        if (settingName && settingValue) {
            let serverSettingsManager = new ServerSettingsManager();


            let serverSetting = serverSettingsManager.getEnum(settingName);

            if (serverSetting != ServerSettingsEnum.None)
            {
                serverSettingsManager.SetSettingValue(serverSetting, settingValue);

                serverSettingsManager.SaveSettings();

                this.AddToResponseMessage(`Setting ${settingName} Changed to ${settingValue} (Server Must be Restarted for Changes to Take Effect)`);
            } else
            {
                this.AddToResponseMessage(`Setting ${settingName} Not Found`);
            }
        } else
            this.AddToResponseMessage("Error Changing Server Setting, Please Provide a Setting and Value");

    };

    public IsEphemeralResponse: boolean = true;

    public Options?: ICommandOption[] = [
        {
            name: 'setting',
            description: 'The Setting to Change',
            required: true,
            type: OptionTypesEnum.String,
            choices: [
                {
                    name: ServerSettingsEnum.DayTimeSpeedRate,
                    value: ServerSettingsEnum.DayTimeSpeedRate
                },
                {
                    name: ServerSettingsEnum.NightTimeSpeedRate,
                    value: ServerSettingsEnum.NightTimeSpeedRate
                },
                {
                    name: ServerSettingsEnum.ExpRate,
                    value: ServerSettingsEnum.ExpRate
                },
                {
                    name: ServerSettingsEnum.PalCaptureRate,
                    value: ServerSettingsEnum.PalCaptureRate
                },
                {
                    name: ServerSettingsEnum.PalSpawnNumRate,
                    value: ServerSettingsEnum.PalSpawnNumRate
                },
                {
                    name: ServerSettingsEnum.PalCaptureRate,
                    value: ServerSettingsEnum.PalCaptureRate
                },
                {
                    name: ServerSettingsEnum.PlayerAutoHPRegeneRate,
                    value: ServerSettingsEnum.PlayerAutoHPRegeneRate
                },
                {
                    name: ServerSettingsEnum.PalAutoHPRegeneRate,
                    value: ServerSettingsEnum.PalAutoHPRegeneRate
                },
                {
                    name: ServerSettingsEnum.PlayerAutoHPRegeneRate,
                    value: ServerSettingsEnum.PlayerAutoHPRegeneRate
                },
                {
                    name: ServerSettingsEnum.CollectionDropRate,
                    value: ServerSettingsEnum.CollectionDropRate
                },
                {
                    name: ServerSettingsEnum.CollectionObjectRespawnSpeedRate,
                    value: ServerSettingsEnum.CollectionObjectRespawnSpeedRate
                },
                {
                    name: ServerSettingsEnum.PalEggDefaultHatchingTime,
                    value: ServerSettingsEnum.PalEggDefaultHatchingTime
                },
            ]
        },
        {
            name: 'value',
            description: 'The Value to Change the Setting to',
            required: true,
            type: OptionTypesEnum.String,
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

export = ChangeSettings;