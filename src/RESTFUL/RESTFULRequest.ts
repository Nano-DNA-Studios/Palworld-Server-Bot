import { BotData } from "dna-discord-framework";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import RESTFULRequestEnum from "./RESTFULRequestEnum";
import { http } from "follow-redirects";
import RESTFULResponseStatusEnum from "./RESTFULResponseStatusEnum";
import RequestOptions from "./RequestOptions";
import RESTFULResponse from "./RESTFULResponse";

class RESTFULRequest implements RequestOptions {

    public hostname: string;
    public port: number;
    public path: string;
    public method: string;
    public headers: { Accept: string; Authorization: string; 'Content-Type'?: string };
    public maxRedirects: number;
    public body?: any;

    constructor(RESTFULCommand: RESTFULRequestEnum) {

        const DataManager = BotData.Instance(PalworldServerBotDataManager)
        this.hostname = DataManager.RESTFUL_HOSTNAME;
        this.port = DataManager.RESTFUL_PORT;
        this.path = `/v1/api/${RESTFULCommand}`;
        this.method = DataManager.RESTFUL_GET_METHOD;
        this.headers = { Accept: 'application/json', Authorization: 'Basic ' + Buffer.from(`admin:${DataManager.SERVER_ADMIN_PASSWORD}`).toString('base64') };
        this.maxRedirects = 20;

        if (RESTFULCommand == RESTFULRequestEnum.SAVE)
            this.method = DataManager.RESTFUL_POST_METHOD;


        if (RESTFULCommand == RESTFULRequestEnum.SHUTDOWN) {
            this.headers = { Accept: 'application/json', Authorization: 'Basic ' + Buffer.from(`admin:${DataManager.SERVER_ADMIN_PASSWORD}`).toString('base64'), 'Content-Type': 'application/json' };
            this.method = DataManager.RESTFUL_POST_METHOD;

            this.body = JSON.stringify({
                "waittime": 30,
                "message": "Server will shutdown in 10 seconds."
            });
        }

    }

    public SendRequest(): Promise<RESTFULResponse> {

        return new Promise<RESTFULResponse>((resolve, reject) => {

            let response: RESTFULResponse;

            response = { status: this.GetRESTFULResponseStatus(RESTFULResponseStatusEnum.ERROR), message: '', error: '' };

            const req = http.request(this, res => {
                response.status = this.GetRESTFULResponseStatus(res.statusCode);

                res.on('data', d => {
                    //process.stdout.write(d);
                    response.message += d.toString();
                });

                res.on('end', () => {
                    resolve(response);  // Resolve the promise with the full response
                });
            });

            req.on('error', e => {
                response.error += e.message;
                reject(e);  // Reject the promise on error
            });

            if (this.method === 'POST' && this.body) {
                if (this.path.includes('shutdown'))
                    console.log(this.body);
                req.write(this.body);  // Write the JSON string body for POST requests
            }

            req.end();
        });
    }

    public SendRequestSync(): RESTFULResponse {

        let response: RESTFULResponse = RESTFULRequest.DefaultError();
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

            const sleep = (milliseconds: number) => {
                const start = new Date().getTime();
                while (new Date().getTime() - start < milliseconds) { }
            };
            sleep(50); // Sleep for 50 milliseconds
        }

        if (!received) {
            console.log("Timeout");
            response.error = 'Timeout';
        } else {

        }

        console.log("Returning Response");
        console.log(response);

        return response;
    }

    private GetRESTFULResponseStatus = (statusCode: number | undefined): RESTFULResponseStatusEnum => {

        switch (statusCode) {
            case 200:
                return RESTFULResponseStatusEnum.SUCCESS;
            case 400:
                return RESTFULResponseStatusEnum.ERROR;
            case 401:
                return RESTFULResponseStatusEnum.UNAUTHORIZED;
            default:
                return RESTFULResponseStatusEnum.ERROR;
        }
    }

    public static DefaultError = (): RESTFULResponse => {
        return { status: RESTFULResponseStatusEnum.ERROR, message: '', error: 'An Error Occurred' };
    }

}

export default RESTFULRequest;