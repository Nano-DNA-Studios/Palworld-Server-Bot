"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const RESTFULRequest_1 = __importDefault(require("../RESTFUL/RESTFULRequest"));
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
const PalworldRESTFULCommandEnum_1 = __importDefault(require("./PalworldRESTFULCommandEnum"));
class PalworldRESTFULCommandFactory {
    static GetCommand(RESTFULCommand) {
        switch (RESTFULCommand) {
            case PalworldRESTFULCommandEnum_1.default.INFO:
                return this.DefaultGetRequest(RESTFULCommand);
            case PalworldRESTFULCommandEnum_1.default.PLAYERS:
                return this.DefaultGetRequest(RESTFULCommand);
            case PalworldRESTFULCommandEnum_1.default.SETTINGS:
                return this.DefaultGetRequest(RESTFULCommand);
            case PalworldRESTFULCommandEnum_1.default.METRICS:
                return this.DefaultGetRequest(RESTFULCommand);
            case PalworldRESTFULCommandEnum_1.default.ANNOUNCE:
                return this.DefaultPostRequest(RESTFULCommand);
            case PalworldRESTFULCommandEnum_1.default.KICK:
            case PalworldRESTFULCommandEnum_1.default.BAN:
            case PalworldRESTFULCommandEnum_1.default.UNBAN:
            case PalworldRESTFULCommandEnum_1.default.SAVE:
                return this.DefaultPostRequest(RESTFULCommand);
            case PalworldRESTFULCommandEnum_1.default.SHUTDOWN:
                return this.DefaultPostRequest(RESTFULCommand);
            case PalworldRESTFULCommandEnum_1.default.FORCESTOP:
                return this.DefaultPostRequest(RESTFULCommand);
            default:
                return this.DefaultGetRequest(RESTFULCommand);
        }
    }
    static DefaultGetRequest(RESTFULCommand) {
        const DataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        return new RESTFULRequest_1.default({
            hostname: DataManager.RESTFUL_HOSTNAME,
            port: DataManager.RESTFUL_PORT,
            path: `/v1/api/${RESTFULCommand}`,
            method: DataManager.RESTFUL_GET_METHOD,
            headers: { Accept: 'application/json', Authorization: 'Basic ' + Buffer.from(`admin:${DataManager.SERVER_ADMIN_PASSWORD}`).toString('base64') },
            maxRedirects: 20,
            maxBodyLength: Infinity
        });
    }
    static DefaultPostRequest(RESTFULCommand) {
        const DataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        return new RESTFULRequest_1.default({
            hostname: DataManager.RESTFUL_HOSTNAME,
            port: DataManager.RESTFUL_PORT,
            path: `/v1/api/${RESTFULCommand}`,
            method: DataManager.RESTFUL_POST_METHOD,
            headers: { Accept: 'application/json', Authorization: 'Basic ' + Buffer.from(`admin:${DataManager.SERVER_ADMIN_PASSWORD}`).toString('base64') },
            maxRedirects: 20,
            maxBodyLength: Infinity
        });
    }
}
exports.default = PalworldRESTFULCommandFactory;
