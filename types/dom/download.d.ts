export declare class Download {
    static downloadOrJSON({ res, filename, onGetJSON }: {
        res: {
            status: number;
            data: any;
        };
        filename: string;
        onGetJSON?: (json: {}) => void;
    }): void;
    static download(filename: string, objectURL: ReturnType<typeof window.URL.createObjectURL>): void;
}
