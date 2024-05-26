import { DiscordBot } from "dna-discord-framework";
import PalworldServerBotDataManager from "./src/PalworldServerBotDataManager";
    
const Bot = new DiscordBot(PalworldServerBotDataManager);

Bot.StartBot();

console.log("Bot Started");