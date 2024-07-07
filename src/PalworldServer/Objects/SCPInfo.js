"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SCPInfo {
    constructor(port, user, hostName, hostDeviceBackupFolder, downloadLocation) {
        this.Port = 0;
        this.User = '';
        this.HostName = '';
        this.HostDeviceBackupFolder = '';
        this.DownloadLocation = '';
        this.Port = port;
        this.User = user;
        this.HostName = hostName;
        this.HostDeviceBackupFolder = hostDeviceBackupFolder;
        this.DownloadLocation = downloadLocation;
    }
}
exports.default = SCPInfo;
