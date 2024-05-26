"use strict";
const dna_discord_framework_1 = require("dna-discord-framework");
class HelloWorld extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        /* <inheritdoc> */
        this.CommandName = 'helloworld';
        /* <inheritdoc> */
        this.CommandDescription = 'A simple Hello World Command';
        /* <inheritdoc> */
        this.RunCommand = async (client, interaction, BotDataManager) => {
            this.InitializeUserResponse(interaction, "Hello World!");
        };
        /* <inheritdoc> */
        this.IsEphemeralResponse = false;
    }
}
module.exports = HelloWorld;
