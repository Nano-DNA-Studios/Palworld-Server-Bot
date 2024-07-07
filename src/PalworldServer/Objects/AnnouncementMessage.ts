import { RESTFULRequest } from "dna-discord-framework";
import PalworldRESTFULCommandFactory from "../RESTFUL/PalworldRESTFULCommandFactory";
import PalworldRESTFULCommandEnum from "../RESTFUL/PalworldRESTFULCommandEnum";


class AnnouncementMessage {

    public message: string;

    constructor(message: string) {
        this.message = message;
    }

    public GetRequest (): RESTFULRequest
    {
        let request: RESTFULRequest = PalworldRESTFULCommandFactory.GetCommand(PalworldRESTFULCommandEnum.ANNOUNCE);

        request.WriteBody({ 'message': this.message });

        return request;
    }
}

export default AnnouncementMessage;