const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const resolve = dir => require('path').join(__dirname, dir);

const config = {
    mode: "development",
    entry: {
        "index": "./src/index.ts",
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    "ts-loader",
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
    devtool: 'sourceMap',
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
        // package.js有了clean命令
        new CleanWebpackPlugin({
           cleanOnceBeforeBuildPatterns: [
               resolve("dist"),
           ],
       }),
    ],
};
module.exports = config;