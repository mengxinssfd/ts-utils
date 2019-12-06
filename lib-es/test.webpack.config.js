const path = require("path");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const resolve = dir => require('path').join(__dirname, dir);
const TsconfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const config = {
    mode: "production",
    entry: {
        index: "./src/index.ts",
    },
    output: {
        path: path.resolve(__dirname, "lib-umd"),
        filename: "[name].js",
        library: 'tsUtils',
        libraryExport: "default",
        globalObject: 'this',
        libraryTarget: 'umd',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    "babel-loader",
                    {
                        loader: "ts-loader",
                        options: {
                            configFile: "tsconfig.webpack.json",
                        },
                    },
                ],
                exclude: [path.resolve(__dirname, "node_modules")],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
    // package.js有了clean命令
    /*new CleanWebpackPlugin({
       cleanOnceBeforeBuildPatterns: [
           resolve("types/!*"),
           resolve("lib-umd/!*"),
           resolve("lib-es/!*"),
       ],
   }),*/
    ],
};
module.exports = config;
