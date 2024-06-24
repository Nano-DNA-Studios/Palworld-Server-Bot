import { Client, ChatInputCommandInteraction, CacheType } from "discord.js";
import { BashScriptRunner, BotData, BotDataManager, Command } from "dna-discord-framework";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";
import { https } from "follow-redirects";



class Ping extends Command {
    public CommandName: string = 'ping';
    public CommandDescription: string = 'Pings the Server to See if it Still Running';
    public RunCommand = async (client: Client<boolean>, interaction: ChatInputCommandInteraction<CacheType>, BotDataManager: BotDataManager) => {

        this.InitializeUserResponse(interaction, `Pinging Server`);

        this.PingServer();


        this.AddToResponseMessage("Server is Still Running");

    };

    public IsEphemeralResponse: boolean = true;

    public PingServer() {

        interface RequestOptions {
            method: string;
            hostname: string;
            port: number;
            path: string;
            headers: {
                Accept: string;
            };
            maxRedirects: number;
        }

        const options = {
            hostname: 'localhost',
            port: 8212,
            path: '/v1/api/info',
            method: 'GET',
            headers: {
              'Authorization': 'Basic ' + Buffer.from('admin:pass').toString('base64')
            }
          };
          
          const req = https.request(options, res => {
            console.log(`Status Code: ${res.statusCode}`);
          
            res.on('data', d => {
              process.stdout.write(d);
            });
          });
          
          req.on('error', e => {
            console.error(e);
          });
          
          req.end();
       
    }

}

export = Ping;