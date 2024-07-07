import { BashScriptRunner, BotData, Command } from "dna-discord-framework";
import ServerMetrics from "../Objects/ServerMetrics";
import { Client } from "discord.js";
import PalworldServerBotDataManager from "../../PalworldServerBotDataManager";
import Player from "../Objects/Player";
import PalworldRESTFULCommandFactory from "./PalworldRESTFULCommandFactory";
import PalworldRESTFULCommandEnum from "./PalworldRESTFULCommandEnum";
import ServerSettingsManager from "../ServerSettingsManager";

class PalworldRestfulCommands {

    public static StartServer(command: Command, client: Client): void {
        try {
            let scriptRunner = new BashScriptRunner();

            scriptRunner.RunLocally("cd /home/steam/PalworldServer && ./PalServer.sh");

            command.AddToResponseMessage("Waiting a few seconds to Ping Server");

            setTimeout(() => { PalworldRestfulCommands.PingServer(command, client) }, 10000)

        } catch (error) {
            command.AddToResponseMessage("Error Starting Server");
        }
    }

    public static PingServer(command: Command, client: Client): void {
        let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.INFO);

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

    public static ShutdownServer(command: Command, client: Client, waittime: number): void {

        this.SaveWorld(command, client);

        setTimeout(() => {
            let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.SHUTDOWN);

            request.WriteBody({ "waittime": waittime, "message": `Server will shutdown in ${waittime} seconds.` })

            request.SendRequest().then((res) => {

                command.AddToResponseMessage("Waiting for Shutdown Confirmation");

                setTimeout(() => { PalworldRestfulCommands.PingServer(command, client) }, (waittime + 5) * 1000)

            }).catch((error) => {
                command.AddToResponseMessage("Error Shutting Down Server");
            });
        }, 3000);
    }

    public static async SaveWorld(command: Command, client: Client) {
        let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.SAVE)

        await request.SendRequest().then((res) => {

            if (res.status == 200)
                command.AddToResponseMessage("Server has been Saved");
            else
                command.AddToResponseMessage("Error Saving the Server");

        }).catch((error) => {
            command.AddToResponseMessage("Error Saving Server");
        });
        
        this.UpdateServerMetrics(client);

        let dataManager = BotData.Instance(PalworldServerBotDataManager);

        setTimeout(() => { dataManager.CreateBackup(); }, (3) * 1000)
    }

    public static ServerSettings(command: Command, client: Client): void {

        let serverSettings = new ServerSettingsManager();

        command.AddTextFileToResponseMessage(serverSettings.GetServerSettingsAsString(), "ServerSettings")

        this.UpdateServerMetrics(client);
    }

    public static ForceStop(command: Command, client: Client): void {
        this.SaveWorld(command, client);

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

    public static Announce(command: Command, client: Client, message: string): void {
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

        this.UpdateServerMetrics(client);
    }

    public static UpdateServerMetrics(client: Client): void {

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

    public static GetPlayers(command: Command, client: Client): void {

        let request = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.PLAYERS);

        request.SendRequest().then((res) => {

            if (res.status == 200) {
                let players: Player[] = [];
                let content = JSON.parse(res.message)['players'];

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

        this.UpdateServerMetrics(client);
    }
}

export default PalworldRestfulCommands;