import { BashScriptRunner, BotData, DiscordBot } from "dna-discord-framework";
import PalworldServerBotDataManager from "./src/PalworldServerBotDataManager";
import PalworldRestfulCommands from "./src/PalworldServer/RESTFUL/PalworldRestfulCommands";

const Bot = new DiscordBot(PalworldServerBotDataManager);

Bot.StartBot();

console.log("Bot Started");

BotData.Instance(PalworldServerBotDataManager).ServerStartReset();

setTimeout(() => {PalworldRestfulCommands.HalfHourlyBackup(Bot.BotInstance);}, 5000);
