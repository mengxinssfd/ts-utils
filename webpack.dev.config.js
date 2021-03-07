const fs = require("fs");
const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const str = fs.readFileSync("./tsconfig.json").toString();
const tsconfig = JSON.parse(str.replace(/\/\//g, ""));
const config = {
    entry: {
        ImgMerge: "./test/merge-img/index.ts",
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
        extensions: [".js", ".ts"],
        alias: (function () {
            const obj = tsconfig.compilerOptions.paths;
            const alias = {};
            for (const k in obj) {
                const v = obj[k];
                alias[k.replace(/\/\*/, "")] = path.resolve(__dirname, v[0].replace(/\/\*/, ""));
            }
            console.log(alias);
            return alias;
        })(),


    },
    plugins: [
        new HtmlPlugin({
            template: "./test/merge-img/index.html",
            filename: "merge-img.html",
            chunks: ["ImgMerge"],// 于loader一样，在后面的会插到前面去
        }),
    ],
};
module.exports = config;