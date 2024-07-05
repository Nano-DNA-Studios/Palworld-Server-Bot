import { BotData, RESTFULRequest } from "dna-discord-framework";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import PalworldRESTFULCommandEnum from "./PalworldRESTFULCommandEnum";

class PalworldRESTFULCommandFactory {

    public static GetCommand(RESTFULCommand: PalworldRESTFULCommandEnum): RESTFULRequest {

        switch (RESTFULCommand) {
            case PalworldRESTFULCommandEnum.INFO:
                return this.DefaultGetRequest(RESTFULCommand);
            case PalworldRESTFULCommandEnum.PLAYERS:
                return this.DefaultGetRequest(RESTFULCommand);
            case PalworldRESTFULCommandEnum.SETTINGS:
                return this.DefaultGetRequest(RESTFULCommand);
            case PalworldRESTFULCommandEnum.METRICS:
                return this.DefaultGetRequest(RESTFULCommand);
            case PalworldRESTFULCommandEnum.ANNOUNCE:
                return this.DefaultPostRequest(RESTFULCommand);
            case PalworldRESTFULCommandEnum.KICK:
                
            case PalworldRESTFULCommandEnum.BAN:

            case PalworldRESTFULCommandEnum.UNBAN:

            case PalworldRESTFULCommandEnum.SAVE:
                return this.DefaultPostRequest(RESTFULCommand);
            case PalworldRESTFULCommandEnum.SHUTDOWN:
                return this.DefaultPostRequest(RESTFULCommand);
            case PalworldRESTFULCommandEnum.FORCESTOP:
                return this.DefaultPostRequest(RESTFULCommand);
            default:
                return this.DefaultGetRequest(RESTFULCommand);
        }
    }

    private static DefaultGetRequest(RESTFULCommand: PalworldRESTFULCommandEnum): RESTFULRequest {
        const DataManager = BotData.Instance(PalworldServerBotDataManager)
        return new RESTFULRequest({
            hostname: DataManager.RESTFUL_HOSTNAME,
            port: DataManager.RESTFUL_PORT,
            path: `/v1/api/${RESTFULCommand}`,
            method: DataManager.RESTFUL_GET_METHOD,
            headers: { Accept: 'application/json', Authorization: 'Basic ' + Buffer.from(`admin:${DataManager.SERVER_ADMIN_PASSWORD}`).toString('base64') },
            maxRedirects: 20,
            maxBodyLength :Infinity
        })
    }

    private static DefaultPostRequest(RESTFULCommand: PalworldRESTFULCommandEnum): RESTFULRequest {
        const DataManager = BotData.Instance(PalworldServerBotDataManager)
        return new RESTFULRequest({
            hostname: DataManager.RESTFUL_HOSTNAME,
            port: DataManager.RESTFUL_PORT,
            path: `/v1/api/${RESTFULCommand}`,
            method: DataManager.RESTFUL_POST_METHOD,
            headers: { Accept: 'application/json', Authorization: 'Basic ' + Buffer.from(`admin:${DataManager.SERVER_ADMIN_PASSWORD}`).toString('base64') },
            maxRedirects: 20,
            maxBodyLength :Infinity
        })
    }
}

export default PalworldRESTFULCommandFactory;