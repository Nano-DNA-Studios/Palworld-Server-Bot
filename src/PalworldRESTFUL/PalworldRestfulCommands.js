"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const ServerSettingsEnum_1 = __importDefault(require("../Options/ServerSettingsEnum"));
const ServerMetrics_1 = __importDefault(require("../ServerObjects/ServerMetrics"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
const Player_1 = __importDefault(require("../ServerObjects/Player"));
const PalworldRESTFULCommandFactory_1 = __importDefault(require("./PalworldRESTFULCommandFactory"));
const PalworldRESTFULCommandEnum_1 = __importDefault(require("./PalworldRESTFULCommandEnum"));
const GameWorldManager_1 = __importDefault(require("../GameWorldManagement/GameWorldManager"));
class PalworldRestfulCommands {
    static PingServer(command, client) {
        let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.INFO);
        request.SendRequest().then((res) => {
            if (res.status == 200)
                command.AddToResponseMessage("Server is Running");
            else
                command.AddToResponseMessage("Server is Not Running");
        }).catch((error) => {
            command.AddToResponseMessage("Server is Not Running");
        });
        this.UpdateServerMetrics(client);
    }
    static ShutdownServer(command, client, waittime) {
        this.SaveWorld(command, client);
        setTimeout(() => {
            let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.SHUTDOWN);
            request.WriteBody({ "waittime": waittime, "message": `Server will shutdown in ${waittime} seconds.` });
            request.SendRequest().then((res) => {
                setTimeout(() => { PalworldRestfulCommands.PingServer(command, client); }, (waittime + 5) * 1000);
            }).catch((error) => {
                command.AddToResponseMessage("Error Shutting Down Server");
            });
        }, 3000);
    }
    static SaveWorld(command, client) {
        let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.SAVE);
        request.SendRequest().then((res) => {
            if (res.status == 200)
                command.AddToResponseMessage("Server has been Saved");
            else
                command.AddToResponseMessage("Error Saving the Server");
        }).catch((error) => {
            command.AddToResponseMessage("Error Saving Server");
        });
        GameWorldManager_1.default.CreateBackup();
        this.UpdateServerMetrics(client);
    }
    static ServerSettings(command, client) {
        let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.SETTINGS);
        request.SendRequest().then((res) => {
            console.log(res);
            if (res.status == 200) {
                let content = JSON.parse(res.message);
                command.AddToResponseMessage("Server Settings: ");
                command.AddToResponseMessage(`Difficulty: ${content[ServerSettingsEnum_1.default.Difficulty]}`);
                command.AddToResponseMessage(`DayTimeSpeedRate: ${content[ServerSettingsEnum_1.default.DayTimeSpeedRate]}`);
                command.AddToResponseMessage(`PalSpawnNumRate: ${content[ServerSettingsEnum_1.default.PalSpawnNumRate]}`);
            }
            else
                command.AddToResponseMessage("Error Retrieving Server Settings");
        }).catch((error) => {
            console.log(error);
            command.AddToResponseMessage("Error Retrieving Server Settings");
        });
        this.UpdateServerMetrics(client);
    }
    static ForceStop(command, client) {
        this.SaveWorld(command, client);
        setTimeout(() => {
            let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.FORCESTOP);
            request.SendRequest().then((res) => {
                if (res.status == 200)
                    command.AddToResponseMessage("Server has been Forced Stopped");
                else
                    command.AddToResponseMessage("Error Force Stopping Server");
            }).catch((error) => {
                console.log(error);
                command.AddToResponseMessage("Error Force Stopping Server");
            });
            this.UpdateServerMetrics(client);
        }, 3000);
    }
    static Announce(command, client, message) {
        let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.ANNOUNCE);
        request.WriteBody({ 'message': message });
        request.SendRequest().then((res) => {
            if (res.status == 200)
                command.AddToResponseMessage("Announcement Sent");
            else
                command.AddToResponseMessage("Error Sending Announcement");
        }).catch((error) => {
            command.AddToResponseMessage("Error Sending Announcement");
        });
        this.UpdateServerMetrics(client);
    }
    static UpdateServerMetrics(client) {
        let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.METRICS);
        request.SendRequest().then((res) => {
            if (res.status == 200) {
                let metrics = new ServerMetrics_1.default(res.message);
                dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default).UpdateMetricsStatus(metrics, client);
            }
        }).catch((error) => {
            dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default).UpdateMetricsStatus(ServerMetrics_1.default.DefaultMetrics(), client);
        });
    }
    static GetPlayers(command, client) {
        let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.PLAYERS);
        request.SendRequest().then((res) => {
            if (res.status == 200) {
                let players = [];
                let content = JSON.parse(res.message)['players'];
                content.forEach((player) => {
                    players.push(new Player_1.default(player));
                });
                players.forEach((player) => {
                    command.AddToResponseMessage(`${player.Name} - Level : ${player.Level} - Location: (${player.LocationX}, ${player.LocationY})`);
                });
            }
            else
                command.AddToResponseMessage("Could not Retreive Players");
        }).catch((error) => {
            command.AddToResponseMessage("Error Retrieving Players");
        });
        this.UpdateServerMetrics(client);
    }
}
exports.default = PalworldRestfulCommands;
