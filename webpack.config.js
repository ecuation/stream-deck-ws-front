const path = require("path");

const ROOT = path.resolve(__dirname, "src");
const DESTINATION = path.resolve(__dirname, "dist");
const Dotenv = require("dotenv-webpack");
module.exports = {
  context: ROOT,
  plugins: [new Dotenv()],

  entry: "./main.ts",

  output: {
    filename: "[name].bundle.js",
    path: DESTINATION,
  },

  resolve: {
    extensions: [".ts", ".js"],
    modules: [ROOT, "node_modules"],
  },

  module: {
    rules: [
      /****************
       * PRE-LOADERS
       *****************/
      {
        enforce: "pre",
        test: /\.js$/,
        use: "source-map-loader",
      },
      {
        enforce: "pre",
        test: /\.ts$/,
        exclude: /node_modules/,
        use: "tslint-loader",
      },

      /****************
       * LOADERS
       *****************/
      {
        test: /\.ts$/,
        exclude: [/node_modules/],
        use: "awesome-typescript-loader",
      },
    ],
  },

  devtool: "cheap-module-source-map",
  devServer: {},
};
