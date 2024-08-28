import { BashScriptRunner, BotData, Command, RESTFULResponseStatusEnum } from "dna-discord-framework";
import ServerMetrics from "../Objects/ServerMetrics";
import { Client } from "discord.js";
import PalworldServerBotDataManager from "../../PalworldServerBotDataManager";
import Player from "../Objects/Player";
import PalworldRESTFULCommandFactory from "./PalworldRESTFULCommandFactory";
import PalworldRESTFULCommandEnum from "./PalworldRESTFULCommandEnum";
import ServerSettingsManager from "../ServerSettingsManager";
import AnnouncementMessage from "../Objects/AnnouncementMessage";

class PalworldRestfulCommands {

    public static async StartServer(command: Command, client: Client): Promise<void> {

        let online = await this.IsServerOnline();

        if (online)
            command.AddToResponseMessage("Server is Already Online");
        else {
            try {
                let scriptRunner = new BashScriptRunner();

                scriptRunner.RunLocally("cd /home/steam/PalworldServer && ./PalServer.sh");

                command.AddToResponseMessage("Waiting a few seconds to Ping Server");

                await setTimeout(() => { PalworldRestfulCommands.PingServer(command, client) }, 15000)

            } catch (error) {
                command.AddToResponseMessage("Error Starting Server");
            }
        }
    }

    public static async PingServer(command: Command, client: Client): Promise<void> {
        let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.INFO);

        request.SendRequest().then((res) => {

            if (res.status == 200)
                command.AddToResponseMessage("Server is Online");
            else
                command.AddToResponseMessage("Server is Offline");

        }).catch((error) => {
            console.log(error);
            command.AddToResponseMessage("Server is Offline");
        });

        this.UpdateServerMetrics(client);
    }

    public static async ShutdownServer(command: Command, client: Client, waittime: number): Promise<void> {

        let online = await this.IsServerOnline();

        if (online) {
            await this.SaveWorld(command, client);

            let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.SHUTDOWN);

            request.WriteBody({ "waittime": waittime, "message": `Server will shutdown in ${waittime} seconds.` })

            let response = await request.SendRequest()

            if (response.status == RESTFULResponseStatusEnum.SUCCESS) {
                command.AddToResponseMessage("Waiting for Shutdown Confirmation");

                await setTimeout(async () => { await PalworldRestfulCommands.PingServer(command, client) }, (waittime + 5) * 1000);
            } else {
                command.AddToResponseMessage("Error Shutting Down Server");
            }

        } else
            command.AddToResponseMessage("Server is Already Offline");
    }

    public static async SaveWorld(command: Command, client: Client) {

        let online = await this.IsServerOnline();

        if (online) {
            let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.SAVE)

            await request.SendRequest().then((res) => {

                if (res.status == 200)
                    command.AddToResponseMessage("Server has been Saved");
                else
                    command.AddToResponseMessage("Error Saving the Server");

            }).catch((error) => {
                command.AddToResponseMessage("Error Saving Server");
            });

            let dataManager = BotData.Instance(PalworldServerBotDataManager);

            setTimeout(() => { dataManager.CreateBackup(); }, (3) * 1000)
        } else {
            command.AddToResponseMessage("Could not Save World, Server is Offline");
        }

        this.UpdateServerMetrics(client);
    }

    public static async ServerSettings(command: Command, client: Client): Promise<void> {

        let serverSettings = new ServerSettingsManager();

        command.AddTextFileToResponseMessage(serverSettings.GetServerSettingsAsString(), "ServerSettings")

        this.UpdateServerMetrics(client);
    }

    public static async ForceStop(command: Command, client: Client): Promise<void> {
        await this.SaveWorld(command, client);

        setTimeout(() => {
            let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.FORCESTOP)

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

    public static async Announce(command: Command, client: Client, message: string): Promise<void> {

        let online = await this.IsServerOnline();

        if (online) {
            let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.ANNOUNCE);

            request.WriteBody({ 'message': message });

            request.SendRequest().then((res) => {

                if (res.status == 200)
                    command.AddToResponseMessage("Announcement Sent");
                else
                    command.AddToResponseMessage("Error Sending Announcement");

            }).catch((error) => {
                command.AddToResponseMessage("Error Sending Announcement");
            });
        } else
            command.AddToResponseMessage("Server is Offline");

        this.UpdateServerMetrics(client);
    }

    public static async UpdateServerMetrics(client: Client): Promise<void> {

        let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.METRICS);

        request.SendRequest().then((res) => {
            if (res.status == 200) {
                let metrics = new ServerMetrics(res.message);

                BotData.Instance(PalworldServerBotDataManager).UpdateMetricsStatus(metrics, client);
            }
        }).catch((error) => {
            BotData.Instance(PalworldServerBotDataManager).UpdateMetricsStatus(ServerMetrics.DefaultMetrics(), client);
        });
    }

    public static async GetPlayers(command: Command, client: Client): Promise<void> {

        this.IsServerOnline().then((online) => {

            if (online) {
                let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.PLAYERS);

                request.SendRequest().then((res) => {

                    if (res.status == 200) {
                        let players: Player[] = [];
                        let content = JSON.parse(res.message)['players'];

                        if (content.length == 0) {
                            command.AddToResponseMessage("No Players Online");
                            return;
                        }

                        content.forEach((player: any) => {
                            players.push(new Player(player));
                        });

                        players.forEach((player) => {
                            command.AddToResponseMessage(`${player.Name} - Level : ${player.Level} - Location: (${player.LocationX}, ${player.LocationY})`);
                        });
                    } else
                        command.AddToResponseMessage("Could not Retreive Players");

                }).catch((error) => {
                    command.AddToResponseMessage("Error Retrieving Players");
                });
            } else
                command.AddToResponseMessage("Server is Offline");

        }).catch((error) => {
            command.AddToResponseMessage("Error Retrieving Players, Server is Offline");
        });

        this.UpdateServerMetrics(client);
    }

    public static async IsServerOnline(): Promise<boolean> {
        try {
            let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.INFO);
            let requestResult = await request.SendRequest()

            if (requestResult.status == 200)
                return true;
            else
                return false;
        } catch (error) {
            return false;
        }
    }

    public static async HalfHourlyBackup(): Promise<void> {

        try {
            this.IsServerOnline().then((online) => {
                if (online) {
                    let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.SAVE);
                    request.SendRequest().then((res) => {
                        if (res.status == 200) {
                            try {
                                let dataManager = BotData.Instance(PalworldServerBotDataManager);
                                dataManager.CreateBackup();
                                new AnnouncementMessage("World has been Backed up Successfully").GetRequest().SendRequest();
                            } catch (error) {
                                new AnnouncementMessage("Error Backing up World, Must be Backed Up Manually").GetRequest().SendRequest();
                            }
                        }
                    }).catch((error) => {
                        console.log(error);
                    });
                }
            }).catch((error) => {
            });
        } catch (error) {
        }

        setTimeout(() => { this.HalfHourlyBackup() }, 1800000);
    }
}

export default PalworldRestfulCommands;