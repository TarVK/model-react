const path = require("path");
const build = path.join(process.cwd(), "build");
module.exports = env => ({
    entry: "./src/index.tsx",
    devtool: env == "prod" ? undefined : "inline-source-map",
    mode: env == "prod" ? "production" : "development",
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: "ts-loader",
                exclude: /node_modules/,
            },
        ],
    },
    devServer: {
        contentBase: [build],
        compress: true,
        port: 3000,
        historyApiFallback: true,
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "bundle.js",
        path: build,
    },
});
