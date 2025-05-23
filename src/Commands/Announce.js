"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
const dna_discord_framework_1 = require("dna-discord-framework");
const PalworldRestfulCommands_1 = __importDefault(require("../PalworldServer/RESTFUL/PalworldRestfulCommands"));
class Announce extends dna_discord_framework_1.Command {
    constructor() {
        super(...arguments);
        this.CommandName = 'announce';
        this.CommandDescription = 'Announces a Message to the Server';
        this.IsCommandBlocking = false;
        this.RunCommand = async (client, interaction, BotDataManager) => {
            const message = interaction.options.getString('message');
            this.InitializeUserResponse(interaction, `Announcing Message: ${message}`);
            if (message)
                await PalworldRestfulCommands_1.default.Announce(this, message);
            await PalworldRestfulCommands_1.default.UpdateServerInfo(client);
        };
        this.IsEphemeralResponse = true;
        this.Options = [
            {
                name: 'message',
                description: 'The message to announce',
                required: true,
                type: dna_discord_framework_1.OptionTypesEnum.String
            }
        ];
    }
}
module.exports = Announce;
