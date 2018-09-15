module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": {
                    "node": "8.0.0"
                }
            }
        ],
        "@babel/preset-typescript"
    ],
    "plugins": [
        "babel-plugin-preval",
        "@babel/plugin-proposal-object-rest-spread",
        ["@babel/plugin-proposal-decorators", { "legacy": true }],
        ["@babel/plugin-proposal-class-properties", { "loose": true }]
    ]
};
