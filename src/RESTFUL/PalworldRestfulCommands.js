"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RESTFULRequest_1 = __importDefault(require("./RESTFULRequest"));
const RESTFULRequestEnum_1 = __importDefault(require("./RESTFULRequestEnum"));
class PalworldRestfulCommands {
    static PingServer(command) {
        let request = new RESTFULRequest_1.default(RESTFULRequestEnum_1.default.INFO);
        request.SendRequest().then((res) => {
            if (res.status == 200)
                command.AddToResponseMessage("Server is Running");
            else
                command.AddToResponseMessage("Server is Not Running");
        }).catch((error) => {
            command.AddToResponseMessage("Server is Not Running, an Error Occurred.");
        });
    }
    static ShutdownServer() {
        let request = new RESTFULRequest_1.default(RESTFULRequestEnum_1.default.SHUTDOWN);
        return request.SendRequest();
    }
}
exports.default = PalworldRestfulCommands;
