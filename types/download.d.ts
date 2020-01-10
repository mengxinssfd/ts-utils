export declare class Download {
    constructor({ res, filename, onGetJSON }: {
        res: {
            status: number;
            data: any;
        };
        filename: string;
        onGetJSON?: (json: {}) => void;
    });
    download(filename: string, res: any): void;
}
