"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const PalworldRESTFULCommandFactory_1 = __importDefault(require("../RESTFUL/PalworldRESTFULCommandFactory"));
const PalworldRESTFULCommandEnum_1 = __importDefault(require("../RESTFUL/PalworldRESTFULCommandEnum"));
class AnnouncementMessage {
    constructor(message) {
        this.message = message;
    }
    GetRequest() {
        let request = PalworldRESTFULCommandFactory_1.default.GetCommand(PalworldRESTFULCommandEnum_1.default.ANNOUNCE);
        request.WriteBody({ 'message': this.message });
        return request;
    }
}
exports.default = AnnouncementMessage;
