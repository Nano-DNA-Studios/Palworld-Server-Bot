import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BotData, BotDataManager, Command } from "dna-discord-framework";
import GameWorldManager from "../ServerManagement/GameWorldManager";
import fsp from "fs/promises";
import fs from "fs";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class ChangeSettings extends Command {

    public CommandName: string = "changesettings";

    public CommandDescription: string = "Changes one of the Server Settings";

    public RunCommand = async (client: Client, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

       
    };

    public IsEphemeralResponse: boolean = true;

}

export = ChangeSettings;