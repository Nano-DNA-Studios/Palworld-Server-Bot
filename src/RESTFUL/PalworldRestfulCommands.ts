import { Command } from "dna-discord-framework";
import RESTFULRequest from "./RESTFULRequest";
import RESTFULRequestEnum from "./RESTFULRequestEnum";
import RESTFULResponse from "./RESTFULResponse";
import ServerSettingsEnum from "../Options/ServerSettingsEnum";

class PalworldRestfulCommands {

    public static PingServer(command: Command): void {
        let request = new RESTFULRequest(RESTFULRequestEnum.INFO);

        request.SendRequest().then((res) => {
            if (res.status == 200)
                command.AddToResponseMessage("Server is Running");
            else
                command.AddToResponseMessage("Server is Not Running");

        }).catch((error) => {
            command.AddToResponseMessage("Server is Not Running, an Error Occurred.");

        });
    }

    public static ShutdownServer(command: Command): void {

        this.SaveWorld(command);

        setTimeout(() => {
            let request = new RESTFULRequest(RESTFULRequestEnum.SHUTDOWN);

            request.SendRequest().then((res) => {
                setTimeout(() => { PalworldRestfulCommands.PingServer(command) }, 3000)

            }).catch((error) => {
                console.log(error);
                command.AddToResponseMessage("Error Shutting Down Server");
            });
        }, 3000);
    }

    public static SaveWorld(command: Command): void {
        let request = new RESTFULRequest(RESTFULRequestEnum.SAVE);

        request.SendRequest().then((res) => {

            if (res.status == 200)
                command.AddToResponseMessage("Server has been Saved");
            else
                command.AddToResponseMessage("Error Saving the Server");

        }).catch((error) => {
            command.AddToResponseMessage("Error Saving Server");
        });
    }

    public static ServerSettings(command: Command): void {

        let request = new RESTFULRequest(RESTFULRequestEnum.SETTINGS);

        request.SendRequest().then((res) => {
            console.log(res);
            if (res.status == 200) {
                let content = JSON.parse(res.message);

                command.AddToResponseMessage("Server Settings: ");

                command.AddToResponseMessage(`Difficulty: ${content[ServerSettingsEnum.Difficulty]}`);
                command.AddToResponseMessage(`DayTimeSpeedRate: ${content[ServerSettingsEnum.DayTimeSpeedRate]}`);
                command.AddToResponseMessage(`PalSpawnNumRate: ${content[ServerSettingsEnum.PalSpawnNumRate]}`);
            }
            else
                command.AddToResponseMessage("Error Retrieving Server Settings");

        }).catch((error) => {
            console.log(error);
            command.AddToResponseMessage("Error Retrieving Server Settings");
        });

    }

    public static ForceStop(command: Command): void {
        this.SaveWorld(command);

        setTimeout(() => {
            let request = new RESTFULRequest(RESTFULRequestEnum.FORCESTOP);

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

    public static Announce (command: Command, message: string): void {
        let request = new RESTFULRequest(RESTFULRequestEnum.ANNOUNCE);

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
}

export default PalworldRestfulCommands;