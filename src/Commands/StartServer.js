"use strict";
const dna_discord_framework_1 = require("dna-discord-framework");
class StartServer extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'startserver';
        this.CommandDescription = 'Starts the Palworld Server';
        this.RunCommand = async (client, interaction, BotDataManager) => {
            let scriptRunner = new dna_discord_framework_1.BashScriptRunner().RunLocally("cd /home/steam/PalworldServer && ./PalServer.sh");
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = StartServer;
