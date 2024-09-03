"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const ServerMetrics_1 = __importDefault(require("../Objects/ServerMetrics"));
const PalworldServerBotDataManager_1 = __importDefault(require("../../PalworldServerBotDataManager"));
const PalworldRESTFULCommandFactory_1 = __importDefault(require("./PalworldRESTFULCommandFactory"));
const PalworldRESTFULCommandEnum_1 = __importDefault(require("./PalworldRESTFULCommandEnum"));
const ServerSettingsManager_1 = __importDefault(require("../ServerSettingsManager"));
const PlayerDatabase_1 = __importDefault(require("../PlayerDatabase"));
class PalworldRestfulCommands {
    static async StartServer(command) {
        let online = await this.IsServerOnline();
        let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        while (!dataManager.IsSafeToStartServer()) {
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
        if (online) {
            command.AddToResponseMessage("Server is Already Online");
            return;
        }
        try {
            let scriptRunner = new dna_discord_framework_1.BashScriptRunner();
            scriptRunner.RunLocally("cd /home/steam/PalworldServer && ./PalServer.sh");
            command.AddToResponseMessage("Waiting a few seconds to Ping Server");
            await new Promise(resolve => setTimeout(resolve, 15000));
            await PalworldRestfulCommands.PingServer(command);
        }
        catch (error) {
            command.AddToResponseMessage("Error Starting Server");
        }
    }
    static async PingServer(command) {
        let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.INFO);
        request.SendRequest().then((res) => {
            if (res.status == 200)
                command.AddToResponseMessage("Server is Online");
            else
                command.AddToResponseMessage("Server is Offline");
        }).catch((error) => {
            console.log("Server is Offline");
            command.AddToResponseMessage("Server is Offline");
        });
    }
    static async ShutdownServer(command, waittime) {
        let online = await this.IsServerOnline();
        if (!online) {
            command.AddToResponseMessage("Server is Already Offline");
            return;
        }
        await this.SaveWorld(command);
        let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.SHUTDOWN);
        request.WriteBody({ "waittime": waittime, "message": `Server will shutdown in ${waittime} seconds.` });
        let response = await request.SendRequest();
        if (response.status == dna_discord_framework_1.RESTFULResponseStatusEnum.SUCCESS) {
            command.AddToResponseMessage("Waiting for Shutdown Confirmation");
            await new Promise(resolve => setTimeout(resolve, (waittime + 5) * 1000));
            await PalworldRestfulCommands.PingServer(command);
            online = await this.IsServerOnline();
            if (online) {
                command.AddToResponseMessage("Error Shutting Down Server, Force Stopping Server");
                this.ForceStop(command);
            }
            return;
        }
        else {
            command.AddToResponseMessage("Error Shutting Down Server");
        }
        let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        dataManager.UpdateShutdownDate();
    }
    static async SaveWorld(command) {
        let online = await this.IsServerOnline();
        if (!online) {
            command.AddToResponseMessage("Could not Save World, Server is Offline");
            return;
        }
        let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.SAVE);
        await request.SendRequest().then((res) => {
            if (res.status == 200)
                command.AddToResponseMessage("Server has been Saved");
            else
                command.AddToResponseMessage("Error Saving the Server");
        }).catch((error) => {
            command.AddToResponseMessage("Error Saving Server");
        });
        let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        await new Promise(resolve => setTimeout(resolve, 5 * 1000));
        await dataManager.CreateBackup();
    }
    static async ServerSettings(command) {
        let serverSettings = new ServerSettingsManager_1.default();
        command.AddTextFileToResponseMessage(serverSettings.GetServerSettingsAsString(), "ServerSettings");
    }
    static async ForceStop(command) {
        await this.SaveWorld(command);
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
        }, 3000);
        let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        dataManager.UpdateShutdownDate();
    }
    static async Announce(command, message) {
        let online = await this.IsServerOnline();
        if (!online) {
            command.AddToResponseMessage("Server is Offline");
            return;
        }
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
    }
    static async GetPlayers() {
        let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        dataManager.PLAYER_DATABASE = new PlayerDatabase_1.default(dataManager.PLAYER_DATABASE);
        let online = await this.IsServerOnline();
        if (!online)
            return;
        let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.PLAYERS);
        let response = await request.SendRequest().catch((error) => {
            dataManager.AddErrorLog(error);
            console.log(`Error Retreiving Players (${error})`);
            return;
        });
        if (!response)
            return;
        if (response.status == 200)
            dataManager.PLAYER_DATABASE.UpdatePlayers(response);
        else
            console.log("Could not Retreive Players");
    }
    static async GetServerMetrics(client) {
        let online = await this.IsServerOnline();
        if (!online) {
            dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default).OfflineActivity(client);
            return;
        }
        let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.METRICS);
        request.SendRequest().then((res) => {
            if (res.status == 200) {
                let metrics = new ServerMetrics_1.default(res.message);
                dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default).SERVER_METRICS = metrics;
            }
        }).catch((error) => {
            dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default).OfflineActivity(client);
        });
    }
    static async UpdateServerInfo(client) {
        await this.GetPlayers();
        await this.GetServerMetrics(client);
    }
    static async IsServerOnline() {
        try {
            let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.INFO);
            let requestResult = await request.SendRequest();
            if (requestResult.status == 200)
                return true;
            else
                return false;
        }
        catch (error) {
            return false;
        }
    }
    static async HalfHourlyBackup(client) {
        try {
            this.IsServerOnline().then((online) => {
                if (online) {
                    let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.SAVE);
                    request.SendRequest().then((res) => {
                        if (res.status == 200) {
                            try {
                                let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
                                dataManager.CreateBackup();
                            }
                            catch (error) {
                            }
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }).catch((error) => {
            });
        }
        catch (error) {
        }
        this.UpdateServerInfo(client);
        setTimeout(() => { this.HalfHourlyBackup(client); }, 1800000);
    }
}
exports.default = PalworldRestfulCommands;
