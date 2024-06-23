"use strict";
const dna_discord_framework_1 = require("dna-discord-framework");
class StartServer extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'startserver';
        this.CommandDescription = 'Starts the Palworld Server';
        this.RunCommand = async (client, interaction, BotDataManager) => {
            this.InitializeUserResponse(interaction, `Starting Server`);
            try {
                let scriptRunner = new dna_discord_framework_1.BashScriptRunner();
                scriptRunner.RunLocally("cd /home/steam/PalworldServer && ./PalServer.sh");
                this.AddToResponseMessage("Server Started!");
            }
            catch (error) {
                this.AddToResponseMessage("Error Starting Server");
                return;
            }
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = StartServer;
