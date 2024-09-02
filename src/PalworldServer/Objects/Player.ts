import PlayerPropertiesEnum from "../Enums/PlayerPropertiesEnum";

class Player
{
    public Name : string;

    public AccountName: string;

    public PlayerID: string;

    public UserID : string;

    public IP : string;

    public Ping : number;

    public LocationX : number;

    public LocationY : number;

    public Level : number;

    constructor(json: any) {
        this.Name = json[PlayerPropertiesEnum.Name];
        this.AccountName = json[PlayerPropertiesEnum.AccountName];
        this.PlayerID = json[PlayerPropertiesEnum.PlayerID];
        this.UserID = json[PlayerPropertiesEnum.UserID];
        this.IP = json[PlayerPropertiesEnum.IP];
        this.Ping = json[PlayerPropertiesEnum.Ping];
        this.LocationX = json[PlayerPropertiesEnum.LocationX];
        this.LocationY = json[PlayerPropertiesEnum.LocationY];
        this.Level = json[PlayerPropertiesEnum.Level];
    }
}

export default Player;