class SCPInfo {

    public Port: number = 0;

    public User: string = '';

    public HostName: string = '';

    public HostDeviceBackupFolder: string = '';

    public DownloadLocation: string = '';

    constructor(data?: any) {
        this.Port = data?.Port ?? 0;
        this.User = data?.User ?? '';
        this.HostName = data?.HostName ?? '';
        this.HostDeviceBackupFolder = data?.HostDeviceBackupFolder ?? '';
        this.DownloadLocation = data?.DownloadLocation ?? '';
    }

    public IsUndefined = (): boolean => {
        return this.Port == 0 || this.User == '' || this.HostName == '' || this.HostDeviceBackupFolder == '' || this.DownloadLocation == '';
    }
}

export default SCPInfo;