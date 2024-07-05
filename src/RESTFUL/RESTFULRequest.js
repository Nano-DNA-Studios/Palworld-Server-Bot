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
    constructor(init) {
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
        this.hostname = init?.hostname || '';
        this.port = init?.port || 0;
        this.path = init?.path || '';
        this.method = init?.method || '';
        this.headers = init?.headers || { Accept: '', Authorization: '' };
        this.maxRedirects = init?.maxRedirects || 0;
        this.maxBodyLength = init?.maxBodyLength;
        this.body = init?.body;
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
            if (this.method === 'POST' && this.body)
                req.write(this.body);
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
