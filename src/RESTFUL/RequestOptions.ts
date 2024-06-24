
interface RequestOptions {
    hostname: string;
    port: number;
    path: string;
    method: string;
    headers: {
        Accept: string;
        Authorization: string;
    };
    maxRedirects: number;
}

export = RequestOptions;