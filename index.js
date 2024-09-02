"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldServerBotDataManager_1 = __importDefault(require("./src/PalworldServerBotDataManager"));
const PalworldRestfulCommands_1 = __importDefault(require("./src/PalworldServer/RESTFUL/PalworldRestfulCommands"));
const Bot = new dna_discord_framework_1.DiscordBot(PalworldServerBotDataManager_1.default);
Bot.StartBot();
console.log("Bot Started");
dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default).ServerStartReset();
setTimeout(() => { PalworldRestfulCommands_1.default.HalfHourlyBackup(Bot.BotInstance); }, 5000);
