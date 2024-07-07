import ServerMetricsEnum from "../Enums/ServerMetricsEnum";

class ServerMetrics {

    public PlayerNum: number = 0;

    public Uptime: number = 0;

    public ServerFrameTime: number = 0;

    public ServerFPS: number = 0;

    public MaxPlayerNum: number = 0;

    constructor(json: string) {
        let content = JSON.parse(json);

        this.PlayerNum = content[ServerMetricsEnum.CurrentPlayerNum];
        this.Uptime = content[ServerMetricsEnum.Uptime];
        this.ServerFrameTime = content[ServerMetricsEnum.ServerFrameTime];
        this.ServerFPS = content[ServerMetricsEnum.ServerFPS];
        this.MaxPlayerNum = content[ServerMetricsEnum.MaxPlayerNum];
    }

    public GetUptime = (): string => {
        const days = Math.floor(this.Uptime / 86400);
        const hours = Math.floor((this.Uptime % 86400) / 3600);
        const minutes = Math.floor((this.Uptime % 3600) / 60);
        let result = "";
    
        if (days > 0) {
            result += `${days} d : `;
        }
        if (hours > 0 || days > 0) {  // Include hours if days are also present
            result += `${hours} h : `;
        }
        if (minutes > 0 || hours > 0 || days > 0) {  // Include minutes if hours or days are present
            result += `${minutes} min`;
        } else {
            // If no minutes, hours, or days, return seconds
            result = `${this.Uptime} sec`;
        }
    
        return result;
    }

    public static DefaultMetrics = (): ServerMetrics => {
        let metrics = new ServerMetrics('{"CurrentPlayerNum":0,"Uptime":0,"ServerFrameTime":0,"ServerFPS":0,"MaxPlayerNum":0}');
        return metrics;
    }

}

export default ServerMetrics;