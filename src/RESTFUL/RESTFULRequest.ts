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
    public headers: { Accept: string; Authorization: string; };
    public maxRedirects: number;

    constructor(RESTFULCommand: RESTFULRequestEnum) {

        const DataManager = BotData.Instance(PalworldServerBotDataManager)
        this.hostname = DataManager.RESTFUL_HOSTNAME;
        this.port = DataManager.RESTFUL_PORT;
        this.path = `/v1/api/${RESTFULCommand}`;
        this.method = DataManager.RESTFUL_METHOD;
        this.headers = { Accept: 'application/json', Authorization: 'Basic ' + Buffer.from(`admin:${DataManager.SERVER_ADMIN_PASSWORD}`).toString('base64') };
        this.maxRedirects = 20;
    }

    private SendRequest(): Promise<RESTFULResponse> {

        return new Promise<RESTFULResponse>((resolve, reject) => {

            let response: RESTFULResponse;

            response = { status: this.GetRESTFULResponseStatus(RESTFULResponseStatusEnum.ERROR), message: '', error: '' };

            const req = http.request(this, res => {
                response.status = this.GetRESTFULResponseStatus(res.statusCode);

                res.on('data', d => {
                    process.stdout.write(d);
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

            req.end();
        });

    }

    public SendRequestSync(): RESTFULResponse {

        let response: RESTFULResponse = RESTFULRequest.DefaultError();
        let loops = 0;
        let received = false;
        const waitTill = new Date(new Date().getTime() + 10);

        this.SendRequest().then((res) => {
            response = res;
            received = true;
            console.log(response);
        }).catch((error) => {
            response.error = error.message;
            received = true;
        });


        // Work on a method to wait for the response

        while (!received) {
            while(waitTill > new Date()){ response.error = "Timeout";}
        }

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