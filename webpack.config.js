const path = require("path");
const build = path.join(process.cwd(), "build");
module.exports = env => ({
    entry: "./src/index.ts",
    // ...(env != "prod" && {devtool: "inline-source-map"}),
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
    externals: {
        // Use external version of React
        react: "react",
        reactDOM: "react-dom",
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        filename: "index.js",
        path: build,
        library: "library",
        libraryTarget: "umd",
    },
});
