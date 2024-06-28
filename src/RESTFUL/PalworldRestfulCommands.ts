import { Command } from "dna-discord-framework";
import RESTFULRequest from "./RESTFULRequest";
import RESTFULRequestEnum from "./RESTFULRequestEnum";
import RESTFULResponse from "./RESTFULResponse";

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

    public static ShutdownServer(): Promise<RESTFULResponse> {
        let request = new RESTFULRequest(RESTFULRequestEnum.SHUTDOWN);

        return request.SendRequest();
    }
}

export default PalworldRestfulCommands;