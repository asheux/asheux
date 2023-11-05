const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require('path');

module.exports = {
    entry: {
        index: path.join(__dirname, "./", "index.js"),
    },
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "[name].[contenthash].js",
        publicPath: "/",
    },
    mode: "development",
    plugins: [
        new HtmlWebpackPlugin({
            title: "Asheux",
            template: path.join(__dirname, "./", "index.html"),
        }),
    ],
    devServer: {
        port: 3000,
        historyApiFallback: { index: "/", disableBotRule: true },
        hot: true,
    },
    optimization: {
        moduleIds: "deterministic",
        runtimeChunk: "single",
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: "vendors",
                    chunks: "all",
                },
            },
        },
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                use: [
                    "style-loader",
                    "css-loader"
                ],
            },
            {
                test: /\.html$/i,
                loader: "html-loader"
            },
            {
                test: /\.(png|svg|jpg|jpeg|gif|pdf)$/i,
                type: "asset/resource",
            },
            {
                test: /\.js$/,
                include: path.resolve(__dirname, "./"),
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env"],
                    },
                },
            },
        ],
    },
    experiments: {
        asyncWebAssembly: true
    }
};
