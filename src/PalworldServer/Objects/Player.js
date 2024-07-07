"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PlayerPropertiesEnum_1 = __importDefault(require("../Enums/PlayerPropertiesEnum"));
class Player {
    constructor(json) {
        this.Name = json[PlayerPropertiesEnum_1.default.Name];
        this.AccountName = json[PlayerPropertiesEnum_1.default.AccountName];
        this.PlayerID = json[PlayerPropertiesEnum_1.default.PlayerID];
        this.UserID = json[PlayerPropertiesEnum_1.default.UserID];
        this.IP = json[PlayerPropertiesEnum_1.default.IP];
        this.Ping = json[PlayerPropertiesEnum_1.default.Ping];
        this.LocationX = json[PlayerPropertiesEnum_1.default.LocationX];
        this.LocationY = json[PlayerPropertiesEnum_1.default.LocationY];
        this.Level = json[PlayerPropertiesEnum_1.default.Level];
    }
}
exports.default = Player;
