"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const Player_1 = __importDefault(require("../PalworldServer/Objects/Player"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
class PlayerDatabase {
    constructor(playerDatabase) {
        //Name --> Player
        this.AllPlayers = {};
        this.OnlinePlayers = {};
        this.AllPlayers = playerDatabase?.AllPlayers ?? {};
        this.OnlinePlayers = {};
    }
    UpdatePlayers(playerData) {
        let players = [];
        let content = JSON.parse(playerData.message)['players'];
        this.OnlinePlayers = {};
        content.forEach((player) => {
            players.push(new Player_1.default(player));
        });
        players.forEach((player) => {
            this.AllPlayers[player.Name] = player;
            this.OnlinePlayers[player.Name] = player;
        });
    }
    GetPlayersDisplay() {
        let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        let message = `${dataManager.SERVER_NAME} Players:`;
        let onlinePlayers = "\nOnline Players:\n";
        let offlinePlayers = "\nOffline Players:\n";
        if (Object.keys(this.OnlinePlayers).length == 0)
            onlinePlayers += "No Players Online\n";
        else {
            Object.keys(this.OnlinePlayers).forEach((key) => {
                let player = this.OnlinePlayers[key];
                onlinePlayers += `${player.Name} - Lvl ${player.Level}\n`;
            });
        }
        Object.keys(this.AllPlayers).forEach((key) => {
            let player = this.AllPlayers[key];
            if (!(player.Name in this.OnlinePlayers))
                offlinePlayers += `${player.Name} - Lvl ${player.Level}\n`;
        });
        if (message.length + onlinePlayers.length < 2000)
            message += onlinePlayers;
        if (message.length + offlinePlayers.length < 2000)
            message += offlinePlayers;
        return message;
    }
}
exports.default = PlayerDatabase;
