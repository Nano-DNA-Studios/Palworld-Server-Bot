"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const ServerMetrics_1 = __importDefault(require("../Objects/ServerMetrics"));
const PalworldServerBotDataManager_1 = __importDefault(require("../../PalworldServerBotDataManager"));
const Player_1 = __importDefault(require("../Objects/Player"));
const PalworldRESTFULCommandFactory_1 = __importDefault(require("./PalworldRESTFULCommandFactory"));
const PalworldRESTFULCommandEnum_1 = __importDefault(require("./PalworldRESTFULCommandEnum"));
const ServerSettingsManager_1 = __importDefault(require("../ServerSettingsManager"));
const AnnouncementMessage_1 = __importDefault(require("../Objects/AnnouncementMessage"));
class PalworldRestfulCommands {
    static async StartServer(command, client) {
        let online = await this.IsServerOnline();
        let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        while (!dataManager.IsSafeToStartServer()) {
            await new Promise(resolve => setTimeout(resolve, 10000));
        }
        if (online)
            command.AddToResponseMessage("Server is Already Online");
        else {
            try {
                let scriptRunner = new dna_discord_framework_1.BashScriptRunner();
                scriptRunner.RunLocally("cd /home/steam/PalworldServer && ./PalServer.sh");
                command.AddToResponseMessage("Waiting a few seconds to Ping Server");
                await new Promise(resolve => setTimeout(resolve, 15000));
                await PalworldRestfulCommands.PingServer(command, client);
                await this.UpdateServerMetrics(client);
            }
            catch (error) {
                command.AddToResponseMessage("Error Starting Server");
            }
        }
    }
    static async PingServer(command, client) {
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
        this.UpdateServerMetrics(client);
    }
    static async ShutdownServer(command, client, waittime) {
        let online = await this.IsServerOnline();
        if (!online) {
            command.AddToResponseMessage("Server is Already Offline");
            return;
        }
        await this.SaveWorld(command, client);
        let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.SHUTDOWN);
        request.WriteBody({ "waittime": waittime, "message": `Server will shutdown in ${waittime} seconds.` });
        let response = await request.SendRequest();
        if (response.status == dna_discord_framework_1.RESTFULResponseStatusEnum.SUCCESS) {
            command.AddToResponseMessage("Waiting for Shutdown Confirmation");
            await new Promise(resolve => setTimeout(resolve, (waittime + 5) * 1000));
            await PalworldRestfulCommands.PingServer(command, client);
            online = await this.IsServerOnline();
            if (online) {
                command.AddToResponseMessage("Error Shutting Down Server, Force Stopping Server");
                this.ForceStop(command, client);
            }
            return;
        }
        else {
            command.AddToResponseMessage("Error Shutting Down Server");
        }
        this.UpdateServerMetrics(client);
        let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        dataManager.UpdateShutdownDate();
    }
    static async SaveWorld(command, client) {
        let online = await this.IsServerOnline();
        if (online) {
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
        else {
            command.AddToResponseMessage("Could not Save World, Server is Offline");
        }
        this.UpdateServerMetrics(client);
    }
    static async ServerSettings(command, client) {
        let serverSettings = new ServerSettingsManager_1.default();
        command.AddTextFileToResponseMessage(serverSettings.GetServerSettingsAsString(), "ServerSettings");
        this.UpdateServerMetrics(client);
    }
    static async ForceStop(command, client) {
        await this.SaveWorld(command, client);
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
        let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        dataManager.UpdateShutdownDate();
    }
    static async Announce(command, client, message) {
        let online = await this.IsServerOnline();
        if (online) {
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
        else
            command.AddToResponseMessage("Server is Offline");
        this.UpdateServerMetrics(client);
    }
    static async UpdateServerMetrics(client) {
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
    static async GetPlayers(command, client) {
        this.IsServerOnline().then((online) => {
            if (online) {
                let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.PLAYERS);
                request.SendRequest().then((res) => {
                    if (res.status == 200) {
                        let players = [];
                        let content = JSON.parse(res.message)['players'];
                        if (content.length == 0) {
                            command.AddToResponseMessage("No Players Online");
                            return;
                        }
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
            }
            else
                command.AddToResponseMessage("Server is Offline");
        }).catch((error) => {
            command.AddToResponseMessage("Error Retrieving Players, Server is Offline");
        });
        this.UpdateServerMetrics(client);
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
    static async HalfHourlyBackup() {
        try {
            this.IsServerOnline().then((online) => {
                if (online) {
                    let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.SAVE);
                    request.SendRequest().then((res) => {
                        if (res.status == 200) {
                            try {
                                let dataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
                                dataManager.CreateBackup();
                                new AnnouncementMessage_1.default("World has been Backed up Successfully").GetRequest().SendRequest();
                            }
                            catch (error) {
                                new AnnouncementMessage_1.default("Error Backing up World, Must be Backed Up Manually").GetRequest().SendRequest();
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
        setTimeout(() => { this.HalfHourlyBackup(); }, 1800000);
    }
}
exports.default = PalworldRestfulCommands;
