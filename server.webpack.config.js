const path = require("path");

module.exports = {
    mode: "development",
    target: "node",
    entry: {
        ServerEntryPoint: "./server/src/ServerEntryPoint",
    },
    module: {
        rules: [
            {
                test: /\.(ts|js)$/,
                use: "babel-loader",
                include: [
                    path.join(__dirname, "client", "src"),
                    path.join(__dirname, "server", "src"),
                ]
            },
        ],
    },
    output: {
        path: path.resolve(__dirname, "server", "out"),
        libraryTarget: 'commonjs2',
        devtoolModuleFilenameTemplate: '../../[resource-path]'
    },
    resolve: {
        extensions: [".ts", ".js"],
    },
    externals: {
        vscode: 'commonjs vscode'
    },
    node: {
        __dirname: false,
        __filename: false,
    },
    devtool: 'nosources-source-map',
};
