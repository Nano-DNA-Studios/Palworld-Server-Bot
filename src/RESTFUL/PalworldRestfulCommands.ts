import RESTFULRequest from "./RESTFULRequest";
import RESTFULRequestEnum from "./RESTFULRequestEnum";
import RESTFULResponse from "./RESTFULResponse";



class PalworldRestfulCommands
{

    public static PingServer() : RESTFULResponse {
        let request = new RESTFULRequest(RESTFULRequestEnum.INFO);

        return request.SendRequestSync();
    }

}

export default PalworldRestfulCommands;