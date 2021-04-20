const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const config = {
  entry: {
    ImgMerge: "./test/merge-img/index.ts",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].js",
  },
  devtool: "eval-source-map",
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