"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RESTFULRequest_1 = __importDefault(require("./RESTFULRequest"));
const RESTFULRequestEnum_1 = __importDefault(require("./RESTFULRequestEnum"));
class PalworldRestfulCommands {
    static PingServer() {
        let request = new RESTFULRequest_1.default(RESTFULRequestEnum_1.default.INFO);
        return request.SendRequestSync();
    }
}
exports.default = PalworldRestfulCommands;
