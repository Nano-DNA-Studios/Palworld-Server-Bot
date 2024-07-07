"use strict";
const dna_discord_framework_1 = require("dna-discord-framework");
class ChangeSettings extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = "changesettings";
        this.CommandDescription = "Changes one of the Server Settings";
        this.RunCommand = async (client, interaction, BotDataManager) => {
        };
        this.IsEphemeralResponse = true;
    }
}
module.exports = ChangeSettings;
