export declare class Download {
    constructor({ res, filename, onGetJSON }: {
        res: {
            status: number;
            data: any;
        };
        filename: string;
        onGetJSON?: (json: {}) => void;
    });
    static download(filename: string, objectURL: ReturnType<typeof window.URL.createObjectURL>): void;
}
