const Path = require("path");
const build = Path.join(process.cwd(), "build");

module.exports = env => ({
    entry: "./src/index.tsx",
    devtool: env == "prod" ? undefined : "inline-source-map",
    mode: env == "prod" ? "production" : "development",
    resolveLoader: {
        alias: {
            "example-loader": Path.resolve("./scripts/exampleLoader.js"),
        },
    },
    module: {
        rules: [
            {
                oneOf: [
                    {
                        test: /\.tsx?$/,
                        use: ["example-loader", "ts-loader"],
                        exclude: /node_modules/,
                        resourceQuery: /\?example/i,
                    },
                    {
                        test: /\.tsx?$/,
                        use: ["ts-loader"],
                        exclude: /node_modules/,
                    },
                ],
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
