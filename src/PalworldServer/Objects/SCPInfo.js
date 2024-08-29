"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class SCPInfo {
    constructor(data) {
        this.Port = 0;
        this.User = '';
        this.HostName = '';
        this.HostDeviceBackupFolder = '';
        this.DownloadLocation = '';
        this.IsUndefined = () => {
            return this.Port == 0 || this.User == '' || this.HostName == '' || this.HostDeviceBackupFolder == '' || this.DownloadLocation == '';
        };
        this.Port = data?.Port ?? 0;
        this.User = data?.User ?? '';
        this.HostName = data?.HostName ?? '';
        this.HostDeviceBackupFolder = data?.HostDeviceBackupFolder ?? '';
        this.DownloadLocation = data?.DownloadLocation ?? '';
    }
}
exports.default = SCPInfo;
