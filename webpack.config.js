const path = require("path");
const {CleanWebpackPlugin} = require("clean-webpack-plugin");
const resolve = dir => require("path").join(__dirname, dir);
const config = {
    mode: "production",
    entry: {
        "index-umd": "./src/index-umd.ts",
    },
    output: {
        path: path.resolve(__dirname, "lib-umd"),
        filename: "[name].js",
        library: "tsUtils", // 指定类库名,主要用于直接引用的方式(比如使用script 标签)
        libraryExport: "default", // 对外暴露default属性，就可以直接调用default里的属性
        globalObject: "this", // 定义全局变量,兼容node和浏览器运行，避免出现"window is not defined"的情况
        libraryTarget: "umd", // 定义打包方式Universal Module Definition,同时支持在CommonJS、AMD和全局变量使用
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