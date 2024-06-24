"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
const follow_redirects_1 = require("follow-redirects");
const RESTFULResponseStatusEnum_1 = __importDefault(require("./RESTFULResponseStatusEnum"));
class RESTFULRequest {
    constructor(RESTFULCommand) {
        this.GetRESTFULResponseStatus = (statusCode) => {
            switch (statusCode) {
                case 200:
                    return RESTFULResponseStatusEnum_1.default.SUCCESS;
                case 400:
                    return RESTFULResponseStatusEnum_1.default.ERROR;
                case 401:
                    return RESTFULResponseStatusEnum_1.default.UNAUTHORIZED;
                default:
                    return RESTFULResponseStatusEnum_1.default.ERROR;
            }
        };
        const DataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        this.hostname = DataManager.RESTFUL_HOSTNAME;
        this.port = DataManager.RESTFUL_PORT;
        this.path = `/v1/api/${RESTFULCommand}`;
        this.method = DataManager.RESTFUL_METHOD;
        this.headers = { Accept: 'application/json', Authorization: 'Basic ' + Buffer.from(`admin:${DataManager.SERVER_ADMIN_PASSWORD}`).toString('base64') };
        this.maxRedirects = 20;
    }
    SendRequest() {
        return new Promise((resolve, reject) => {
            let response;
            response = { status: this.GetRESTFULResponseStatus(RESTFULResponseStatusEnum_1.default.ERROR), message: '', error: '' };
            const req = follow_redirects_1.http.request(this, res => {
                response.status = this.GetRESTFULResponseStatus(res.statusCode);
                res.on('data', d => {
                    process.stdout.write(d);
                    response.message += d.toString();
                });
                res.on('end', () => {
                    resolve(response); // Resolve the promise with the full response
                });
            });
            req.on('error', e => {
                response.error += e.message;
                reject(e); // Reject the promise on error
            });
            req.end();
        });
    }
    SendRequestSync() {
        let response = RESTFULRequest.DefaultError();
        let loops = 0;
        let received = false;
        this.SendRequest().then((res) => {
            response = res;
            received = true;
            console.log(response);
        }).catch((error) => {
            response.error = error.message;
            received = true;
        });
        while (!received) {
            const waitTill = new Date(new Date().getTime() + 10);
            while (waitTill > new Date()) {
                response.error = "Timeout";
            }
        }
        return response;
    }
}
RESTFULRequest.DefaultError = () => {
    return { status: RESTFULResponseStatusEnum_1.default.ERROR, message: '', error: 'An Error Occurred' };
};
exports.default = RESTFULRequest;
