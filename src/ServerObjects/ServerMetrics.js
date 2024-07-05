"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ServerMetricsEnum_1 = __importDefault(require("../Options/ServerMetricsEnum"));
class ServerMetrics {
    constructor(json) {
        this.PlayerNum = 0;
        this.Uptime = 0;
        this.ServerFrameTime = 0;
        this.ServerFPS = 0;
        this.MaxPlayerNum = 0;
        this.GetUptime = () => {
            const days = Math.floor(this.Uptime / 86400);
            const hours = Math.floor((this.Uptime % 86400) / 3600);
            const minutes = Math.floor((this.Uptime % 3600) / 60);
            let result = "";
            if (days > 0) {
                result += `${days} d : `;
            }
            if (hours > 0 || days > 0) { // Include hours if days are also present
                result += `${hours} h : `;
            }
            if (minutes > 0 || hours > 0 || days > 0) { // Include minutes if hours or days are present
                result += `${minutes} min`;
            }
            else {
                // If no minutes, hours, or days, return seconds
                result = `${this.Uptime} sec`;
            }
            return result;
        };
        let content = JSON.parse(json);
        this.PlayerNum = content[ServerMetricsEnum_1.default.CurrentPlayerNum];
        this.Uptime = content[ServerMetricsEnum_1.default.Uptime];
        this.ServerFrameTime = content[ServerMetricsEnum_1.default.ServerFrameTime];
        this.ServerFPS = content[ServerMetricsEnum_1.default.ServerFPS];
        this.MaxPlayerNum = content[ServerMetricsEnum_1.default.MaxPlayerNum];
    }
}
ServerMetrics.DefaultMetrics = () => {
    let metrics = new ServerMetrics('{"CurrentPlayerNum":0,"Uptime":0,"ServerFrameTime":0,"ServerFPS":0,"MaxPlayerNum":0}');
    return metrics;
};
exports.default = ServerMetrics;
