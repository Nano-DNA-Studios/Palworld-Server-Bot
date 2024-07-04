"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const RESTFULRequest_1 = __importDefault(require("./RESTFULRequest"));
const RESTFULRequestEnum_1 = __importDefault(require("./RESTFULRequestEnum"));
const ServerSettingsEnum_1 = __importDefault(require("../Options/ServerSettingsEnum"));
const ServerMetrics_1 = __importDefault(require("../ServerObjects/ServerMetrics"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
class PalworldRestfulCommands {
    static PingServer(command) {
        let request = new RESTFULRequest_1.default(RESTFULRequestEnum_1.default.INFO);
        request.SendRequest().then((res) => {
            if (res.status == 200)
                command.AddToResponseMessage("Server is Running");
            else
                command.AddToResponseMessage("Server is Not Running");
        }).catch((error) => {
            command.AddToResponseMessage("Server is Not Running, an Error Occurred.");
        });
    }
    static ShutdownServer(command) {
        this.SaveWorld(command);
        setTimeout(() => {
            let request = new RESTFULRequest_1.default(RESTFULRequestEnum_1.default.SHUTDOWN);
            request.SendRequest().then((res) => {
                setTimeout(() => { PalworldRestfulCommands.PingServer(command); }, 3000);
            }).catch((error) => {
                console.log(error);
                command.AddToResponseMessage("Error Shutting Down Server");
            });
        }, 3000);
    }
    static SaveWorld(command) {
        let request = new RESTFULRequest_1.default(RESTFULRequestEnum_1.default.SAVE);
        request.SendRequest().then((res) => {
            if (res.status == 200)
                command.AddToResponseMessage("Server has been Saved");
            else
                command.AddToResponseMessage("Error Saving the Server");
        }).catch((error) => {
            command.AddToResponseMessage("Error Saving Server");
        });
    }
    static ServerSettings(command) {
        let request = new RESTFULRequest_1.default(RESTFULRequestEnum_1.default.SETTINGS);
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
    }
    static ForceStop(command) {
        this.SaveWorld(command);
        setTimeout(() => {
            let request = new RESTFULRequest_1.default(RESTFULRequestEnum_1.default.FORCESTOP);
            request.SendRequest().then((res) => {
                if (res.status == 200)
                    command.AddToResponseMessage("Server has been Forced Stopped");
                else
                    command.AddToResponseMessage("Error Force Stopping Server");
            }).catch((error) => {
                console.log(error);
                command.AddToResponseMessage("Error Force Stopping Server");
            });
        }, 3000);
    }
    static Announce(command, message) {
        let request = new RESTFULRequest_1.default(RESTFULRequestEnum_1.default.ANNOUNCE);
        request.WriteBody({ 'message': message });
        request.SendRequest().then((res) => {
            if (res.status == 200)
                command.AddToResponseMessage("Announcement Sent");
            else
                command.AddToResponseMessage("Error Sending Announcement");
        }).catch((error) => {
            command.AddToResponseMessage("Error Sending Announcement");
        });
    }
    static UpdateServerMetrics(command, client) {
        let request = new RESTFULRequest_1.default(RESTFULRequestEnum_1.default.METRICS);
        request.SendRequest().then((res) => {
            if (res.status == 200) {
                let metrics = new ServerMetrics_1.default(res.message);
                dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default).UpdateMetricsStatus(metrics, client);
            }
        }).catch((error) => {
        });
    }
}
exports.default = PalworldRestfulCommands;
