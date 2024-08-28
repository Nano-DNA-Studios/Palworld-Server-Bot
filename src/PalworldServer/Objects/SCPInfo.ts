class SCPInfo {

    public Port: number = 0;

    public User: string = '';

    public HostName: string = '';

    public HostDeviceBackupFolder: string = '';

    public DownloadLocation: string = '';

    constructor(port: number, user: string, hostName: string, hostDeviceBackupFolder: string, downloadLocation: string) {
        this.Port = port;
        this.User = user;
        this.HostName = hostName;
        this.HostDeviceBackupFolder = hostDeviceBackupFolder;
        this.DownloadLocation = downloadLocation;
    }

    public IsUndefined = (): boolean => {
        return this.Port == 0 || this.User == '' || this.HostName == '' || this.HostDeviceBackupFolder == '' || this.DownloadLocation == '';
    }
}

export default SCPInfo;