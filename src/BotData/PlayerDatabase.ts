import { BotData } from "dna-discord-framework";
import Player from "../PalworldServer/Objects/Player";
import PalworldServerBotDataManager from "../PalworldServerBotDataManager";

class PlayerDatabase {

    //User ID --> Player
    public AllPlayers: Record<string, Player> = {};

    public OnlinePlayers: Record<string, Player> = {};

    constructor(playerDatabase?: any) {
        this.AllPlayers = playerDatabase?.Players ?? {};
        this.OnlinePlayers = {};
    }

    public UpdatePlayers(playerData: any): void {

        let players: Player[] = [];
        let content = JSON.parse(playerData.message)['players'];

        content.forEach((player: any) => {
            players.push(new Player(player));
        });

        players.forEach((player: Player) => {
            this.AllPlayers[player.UserID] = player;
            this.OnlinePlayers[player.UserID] = player;
        });
    }

    public GetPlayersDisplay(): string {

        let dataManager = BotData.Instance(PalworldServerBotDataManager);
        let message = `${dataManager.SERVER_NAME} Players:`;
        let onlinePlayers: string = "\nOnline Players:\n";
        let offlinePlayers: string = "\n\nOffline Players:\n";

        if (Object.keys(this.OnlinePlayers).length == 0)
            onlinePlayers += "No Players Online";
        else{
            Object.keys(this.OnlinePlayers).forEach((key: string) => {
                let player = this.OnlinePlayers[key];
                onlinePlayers += `${player.Name} - Lvl ${player.Level}`;
            });
        }

        Object.keys(this.AllPlayers).forEach((key: string) => {
            let player = this.AllPlayers[key];
            if (!(player.UserID in this.OnlinePlayers))
                offlinePlayers += `${player.Name} - Lvl ${player.Level}`;
        });

        if (message.length + onlinePlayers.length < 2000)
            message += onlinePlayers;

        if (message.length + offlinePlayers.length < 2000)
            message += offlinePlayers;

        return message;
    }

}

export default PlayerDatabase;