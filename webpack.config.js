const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const resolve = dir => require('path').join(__dirname, dir);

const config = {
    mode: "development",
    entry: {
        index: "./src/index.ts",
    },
    output: {
        path: path.resolve(__dirname, "lib"),
        filename: "[name].js",
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: ["babel-loader", "ts-loader"],
                exclude: [path.resolve(__dirname, "node_modules")],
            },
        ],
    },
    resolve: {
        extensions: [".ts", ".tsx", ".js"],
    },
    plugins: [
        new CleanWebpackPlugin({cleanOnceBeforeBuildPatterns: ["./types", "./lib"]}),
    ],
};
module.exports = config;