import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command, ICommandOption, OptionTypesEnum } from "dna-discord-framework";
import PalworldServerSettingsEnum from "../PalworldServer/Enums/PalworldServerSettingsEnum";
import ServerSettingsManager from "../PalworldServer/ServerSettingsManager";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import PalworldRestfulCommands from "../PalworldServer/RESTFUL/PalworldRestfulCommands";

class ChangeSettings extends Command {

    public CommandName: string = "changesettings";

    public CommandDescription: string = "Changes one of the Server Settings";

    public IsCommandBlocking: boolean = false;

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        let settingName = interaction.options.getString('setting');
        let settingValue = interaction.options.getString('value');

        this.InitializeUserResponse(interaction, `Changing Server Setting`);

        if (settingName && settingValue) {
            let serverSettingsManager = new ServerSettingsManager();
            let serverSetting = serverSettingsManager.getEnum(settingName);

            if (serverSetting != PalworldServerSettingsEnum.None) {
                if (serverSettingsManager.NewServer)
                    this.AddToResponseMessage(`You're changing the setting on a new server, please setup the server using /setup first.`);
                else {
                    serverSettingsManager.SetNumberSettingValue(serverSetting, settingValue);

                    serverSettingsManager.SaveSettings();

                    this.AddToResponseMessage(`Setting ${settingName} Changed to ${settingValue} (Server Must be Restarted for Changes to Take Effect)`);
                }
            } else {
                this.AddToResponseMessage(`Setting ${settingName} Not Found`);
            }
        } else
            this.AddToResponseMessage("Error Changing Server Setting, Please Provide a Setting and Value");

        await PalworldRestfulCommands.UpdateServerInfo(client);
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
                    name: PalworldServerSettingsEnum.DayTimeSpeedRate,
                    value: PalworldServerSettingsEnum.DayTimeSpeedRate
                },
                {
                    name: PalworldServerSettingsEnum.NightTimeSpeedRate,
                    value: PalworldServerSettingsEnum.NightTimeSpeedRate
                },
                {
                    name: PalworldServerSettingsEnum.ExpRate,
                    value: PalworldServerSettingsEnum.ExpRate
                },
                {
                    name: PalworldServerSettingsEnum.PalCaptureRate,
                    value: PalworldServerSettingsEnum.PalCaptureRate
                },
                {
                    name: PalworldServerSettingsEnum.PalSpawnNumRate,
                    value: PalworldServerSettingsEnum.PalSpawnNumRate
                },
                {
                    name: PalworldServerSettingsEnum.PalCaptureRate,
                    value: PalworldServerSettingsEnum.PalCaptureRate
                },
                {
                    name: PalworldServerSettingsEnum.PlayerAutoHPRegeneRate,
                    value: PalworldServerSettingsEnum.PlayerAutoHPRegeneRate
                },
                {
                    name: PalworldServerSettingsEnum.PalAutoHPRegeneRate,
                    value: PalworldServerSettingsEnum.PalAutoHPRegeneRate
                },
                {
                    name: PalworldServerSettingsEnum.PlayerAutoHPRegeneRate,
                    value: PalworldServerSettingsEnum.PlayerAutoHPRegeneRate
                },
                {
                    name: PalworldServerSettingsEnum.CollectionDropRate,
                    value: PalworldServerSettingsEnum.CollectionDropRate
                },
                {
                    name: PalworldServerSettingsEnum.CollectionObjectRespawnSpeedRate,
                    value: PalworldServerSettingsEnum.CollectionObjectRespawnSpeedRate
                },
                {
                    name: PalworldServerSettingsEnum.PalEggDefaultHatchingTime,
                    value: PalworldServerSettingsEnum.PalEggDefaultHatchingTime
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