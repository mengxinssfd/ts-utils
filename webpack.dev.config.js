const path = require("path");
const HtmlPlugin = require("html-webpack-plugin");
const config = {
  entry: {
    ImgMerge: "./test/merge-img/index.ts",
    layer: "./test/merge-img/layer.ts",
    touch: "./test/touch/index.ts",
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
              configFile: "tsconfig.webpack.dev.json",
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
    new HtmlPlugin({
      template: "./test/merge-img/index.html",
      filename: "layer.html",
      chunks: ["layer"],// 于loader一样，在后面的会插到前面去
    }),
    new HtmlPlugin({
      template: "./test/touch/index.html",
      filename: "touch.html",
      chunks: ["touch"],// 于loader一样，在后面的会插到前面去
    }),
  ],
};
module.exports = config;