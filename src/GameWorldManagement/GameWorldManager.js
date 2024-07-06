"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
class GameWorldManager {
    static CreateBackup() {
        let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        let runner = new dna_discord_framework_1.BashScriptRunner();
        const backupFilePath = "/home/steam/Backups/WorldBackup.tar.gz";
        runner.RunLocally(`cd ${dataManager.PALWORLD_GAME_FILES} && cd .. && tar -czvf ${backupFilePath} Saved/*`);
    }
}
exports.default = GameWorldManager;
