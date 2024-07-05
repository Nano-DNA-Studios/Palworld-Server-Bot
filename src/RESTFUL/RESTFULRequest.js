"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldServerBotDataManager_1 = __importDefault(require("../PalworldServerBotDataManager"));
const RESTFULRequestEnum_1 = __importDefault(require("./RESTFULRequestEnum"));
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
        this.WriteBody = (content) => {
            const DataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
            let stringifiedContent = JSON.stringify(content);
            this.body = stringifiedContent;
            this.headers = { Accept: 'application/json', Authorization: 'Basic ' + Buffer.from(`admin:${DataManager.SERVER_ADMIN_PASSWORD}`).toString('base64'), 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(stringifiedContent) };
        };
        const DataManager = dna_discord_framework_1.BotData.Instance(PalworldServerBotDataManager_1.default);
        this.hostname = DataManager.RESTFUL_HOSTNAME;
        this.port = DataManager.RESTFUL_PORT;
        this.path = `/v1/api/${RESTFULCommand}`;
        this.method = DataManager.RESTFUL_GET_METHOD;
        this.headers = { Accept: 'application/json', Authorization: 'Basic ' + Buffer.from(`admin:${DataManager.SERVER_ADMIN_PASSWORD}`).toString('base64') };
        this.maxRedirects = 20;
        if (RESTFULCommand == RESTFULRequestEnum_1.default.SAVE)
            this.method = DataManager.RESTFUL_POST_METHOD;
        if (RESTFULCommand == RESTFULRequestEnum_1.default.SHUTDOWN) {
            let shutdownBody = JSON.stringify({
                "waittime": 30,
                "message": "Server will shutdown in 10 seconds."
            });
            this.body = shutdownBody;
            this.headers = { Accept: 'application/json', Authorization: 'Basic ' + Buffer.from(`admin:${DataManager.SERVER_ADMIN_PASSWORD}`).toString('base64'), 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(shutdownBody) };
            this.method = DataManager.RESTFUL_POST_METHOD;
        }
        if (RESTFULCommand == RESTFULRequestEnum_1.default.FORCESTOP)
            this.method = DataManager.RESTFUL_POST_METHOD;
        if (RESTFULCommand == RESTFULRequestEnum_1.default.ANNOUNCE)
            this.method = DataManager.RESTFUL_POST_METHOD;
        if (RESTFULCommand == RESTFULRequestEnum_1.default.PLAYERS)
            this.maxBodyLength = Infinity;
        // console.log(JSON.stringify(this));
    }
    SendRequest() {
        return new Promise((resolve, reject) => {
            let response;
            response = { status: this.GetRESTFULResponseStatus(RESTFULResponseStatusEnum_1.default.ERROR), message: '', error: '' };
            const req = follow_redirects_1.http.request(this, res => {
                response.status = this.GetRESTFULResponseStatus(res.statusCode);
                res.on('data', d => {
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
            if (this.method === 'POST' && this.body) {
                if (this.path.includes('shutdown'))
                    console.log(this.body);
                req.write(this.body); // Write the JSON string body for POST requests
            }
            req.end();
        });
    }
    SendRequestSync() {
        let response = RESTFULRequest.DefaultError();
        let loops = 0;
        let received = false;
        const waitTill = new Date(new Date().getTime() + 30000); // 30 seconds
        let idk = this.SendRequest().then((res) => {
            response = res;
            received = true;
            console.log("Response Received");
            console.log(response);
        }).catch((error) => {
            response.error = error.message;
            received = true;
        });
        // Work on a method to wait for the response
        while (!received && new Date() < waitTill) {
            const sleep = (milliseconds) => {
                const start = new Date().getTime();
                while (new Date().getTime() - start < milliseconds) { }
            };
            sleep(50); // Sleep for 50 milliseconds
        }
        if (!received) {
            console.log("Timeout");
            response.error = 'Timeout';
        }
        else {
        }
        console.log("Returning Response");
        console.log(response);
        return response;
    }
}
RESTFULRequest.DefaultError = () => {
    return { status: RESTFULResponseStatusEnum_1.default.ERROR, message: '', error: 'An Error Occurred' };
};
exports.default = RESTFULRequest;
