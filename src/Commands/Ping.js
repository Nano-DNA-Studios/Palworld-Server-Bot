"use strict";
const dna_discord_framework_1 = require("dna-discord-framework");
const follow_redirects_1 = require("follow-redirects");
class Ping extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'ping';
        this.CommandDescription = 'Pings the Server to See if it Still Running';
        this.RunCommand = async (client, interaction, BotDataManager) => {
            this.InitializeUserResponse(interaction, `Pinging Server`);
            this.PingServer();
            this.AddToResponseMessage("Server is Still Running");
        };
        this.IsEphemeralResponse = true;
    }
    PingServer() {
        const options = {
            hostname: 'localhost',
            port: 8212,
            path: '/v1/api/info',
            method: 'GET',
            headers: {
                'Authorization': 'Basic ' + Buffer.from('admin:pass').toString('base64')
            }
        };
        const req = follow_redirects_1.https.request(options, res => {
            console.log(`Status Code: ${res.statusCode}`);
            res.on('data', d => {
                process.stdout.write(d);
            });
        });
        req.on('error', e => {
            console.error(e);
        });
        req.end();
        // try 
        // {
        //     let options = {
        //         'method': 'GET',
        //         'hostname': 'localhost',
        //         'port': 8212,
        //         // Include credentials in the URL
        //         'path': '/v1/api/info',
        //         'headers': {
        //         'Accept': 'application/json'
        //         },
        //         'auth': 'admin:pass', // This line adds the credentials
        //         'maxRedirects': 20
        //       };
        //     const req = https.request(options, (res) => {
        //         let chunks: Buffer[] = [];
        //         res.on("data", (chunk) => {
        //             chunks.push(chunk);
        //         });
        //         res.on("end", () => {
        //             let body = Buffer.concat(chunks);
        //             console.log(body.toString());
        //         });
        //         res.on("error", (error) => {
        //             console.error(error);
        //         });
        //     });
        //     req.end();
        // } catch (error)
        // {
        //     console.log(error);
        // }
        // let config = {
        // method: 'get',
        // maxBodyLength: Infinity,
        // url: 'http://localhost:8212/v1/api/info',
        // headers: { 
        //     'Accept': 'application/json'
        // }
        // };
        // axios(config)
        // .then((response) => {
        // console.log(JSON.stringify(response.data));
        // })
        // .catch((error) => {
        // console.log(error);
        // });
    }
}
module.exports = Ping;
