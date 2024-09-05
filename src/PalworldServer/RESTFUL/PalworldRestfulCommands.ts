import { BashScriptRunner, BotData, Command, RESTFULResponseStatusEnum , RESTFULResponse} from "dna-discord-framework";
import ServerMetrics from "../Objects/ServerMetrics";
import { Client } from "discord.js";
import PalworldServerBotDataManager from "../../PalworldServerBotDataManager";
import PalworldRESTFULCommandFactory from "./PalworldRESTFULCommandFactory";
import PalworldRESTFULCommandEnum from "./PalworldRESTFULCommandEnum";
import ServerSettingsManager from "../ServerSettingsManager";
import PlayerDatabase from "../PlayerDatabase";

class PalworldRestfulCommands {

    public static async StartServer(command: Command): Promise<void> {

        let online = await this.IsServerOnline();

        let dataManager = BotData.Instance(PalworldServerBotDataManager);

        while (!dataManager.IsSafeToStartServer()) {
            await new Promise(resolve => setTimeout(resolve, 10000));
        }

        if (online) {
            command.AddToResponseMessage("Server is Already Online");
            return;
        }

        try {
            let scriptRunner = new BashScriptRunner();

            scriptRunner.RunLocally("cd /home/steam/PalworldServer && ./PalServer.sh");

            command.AddToResponseMessage("Waiting a few seconds to Ping Server");

            await new Promise(resolve => setTimeout(resolve, 15000));

            await PalworldRestfulCommands.PingServer(command);
        } catch (error) {
            command.AddToResponseMessage("Error Starting Server");
        }
    }

    public static async PingServer(command: Command): Promise<void> {
        let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.INFO);

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

    public static async ShutdownServer(command: Command, waittime: number): Promise<void> {

        let online = await this.IsServerOnline();

        if (!online) {
            command.AddToResponseMessage("Server is Already Offline");
            return;
        }

        await this.SaveWorld(command);

        let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.SHUTDOWN);

        request.WriteBody({ "waittime": waittime, "message": `Server will shutdown in ${waittime} seconds.` })

        let response = await request.SendRequest()

        if (response.status == RESTFULResponseStatusEnum.SUCCESS) {
            command.AddToResponseMessage("Waiting for Shutdown Confirmation");

            await new Promise(resolve => setTimeout(resolve, (waittime + 5) * 1000));

            await PalworldRestfulCommands.PingServer(command);

            online = await this.IsServerOnline();

            if (online) {
                command.AddToResponseMessage("Error Shutting Down Server, Force Stopping Server");
                this.ForceStop(command);
            }

            return;
        } else {
            command.AddToResponseMessage("Error Shutting Down Server");
        }

        let dataManager = BotData.Instance(PalworldServerBotDataManager);
        dataManager.UpdateShutdownDate();
    }

    public static async SaveWorld(command: Command) {

        let online = await this.IsServerOnline();

        if (!online) {
            command.AddToResponseMessage("Could not Save World, Server is Offline");
            return;
        }

        let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.SAVE)

        let response = await request.SendRequest().catch((error) => {
            command.AddToResponseMessage("Error Saving Server");
            return;
        });

        if (!response)
        return;

        if (response.status == 200)
            command.AddToResponseMessage("Server has been Saved");
        else
            command.AddToResponseMessage("Error Saving the Server");

        let dataManager = BotData.Instance(PalworldServerBotDataManager);

        await new Promise(resolve => setTimeout(resolve, 5 * 1000));

        await dataManager.CreateBackup();
    }

    public static async ServerSettings(command: Command): Promise<void> {

        let serverSettings = new ServerSettingsManager();

        command.AddTextFileToResponseMessage(serverSettings.GetServerSettingsAsString(), "ServerSettings")
    }

    public static async ForceStop(command: Command): Promise<void> {
        await this.SaveWorld(command);

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
        }, 3000);

        let dataManager = BotData.Instance(PalworldServerBotDataManager);
        dataManager.UpdateShutdownDate();
    }

    public static async Announce(command: Command, message: string): Promise<void> {

        let online = await this.IsServerOnline();

        if (!online) {
            command.AddToResponseMessage("Server is Offline");
            return;
        }

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
    }

    public static async GetPlayers(): Promise<void> {
        let dataManager = BotData.Instance(PalworldServerBotDataManager);
        dataManager.PLAYER_DATABASE = new PlayerDatabase(dataManager.PLAYER_DATABASE);

        let online = await this.IsServerOnline();

        if (!online)
            return;

        let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.PLAYERS);

        let response = await request.SendRequest().catch((error) => {
            dataManager.AddErrorLog(error)
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

    public static async GetServerMetrics(client: Client): Promise<void> {

        let online = await this.IsServerOnline();

        if (!online) {
            BotData.Instance(PalworldServerBotDataManager).OfflineActivity(client);
            return;
        }

        let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.METRICS);

        request.SendRequest().then((res) => {
            if (res.status == 200) {
                let metrics = new ServerMetrics(res.message);

                BotData.Instance(PalworldServerBotDataManager).SERVER_METRICS = metrics;
            }
        }).catch((error) => {
            BotData.Instance(PalworldServerBotDataManager).OfflineActivity(client);
        });
    }

    public static async UpdateServerInfo(client: Client): Promise<void> {
        await this.GetPlayers();
        await this.GetServerMetrics(client);
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

    public static async HalfHourlyBackup(client: Client): Promise<void> {

        try {
            this.IsServerOnline().then((online) => {
                if (online) {
                    let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.SAVE);
                    request.SendRequest().then((res) => {
                        if (res.status == 200) {
                            try {
                                let dataManager = BotData.Instance(PalworldServerBotDataManager);
                                dataManager.CreateBackup();
                            } catch (error) {
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

        this.UpdateServerInfo(client);

        setTimeout(() => { this.HalfHourlyBackup(client) }, 1800000);
    }
}

export default PalworldRestfulCommands;