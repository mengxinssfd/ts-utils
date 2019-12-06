export = config;
declare const config: {
    mode: string;
    entry: {
        index: string;
    };
    output: {
        path: string;
        filename: string;
        library: string;
        libraryExport: string;
        globalObject: string;
        libraryTarget: string;
    };
    module: {
        rules: {
            test: RegExp;
            use: (string | {
                loader: string;
                options: {
                    configFile: string;
                };
            })[];
            exclude: string[];
        }[];
    };
    resolve: {
        extensions: string[];
    };
    plugins: never[];
};
