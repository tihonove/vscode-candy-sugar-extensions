// @preval
const fs = require("fs");
const path = require("path");
const peg = require("pegjs");

module.exports = peg.generate(
    fs.readFileSync(require.resolve("./SchemaRng.pegjs"), "utf8"), {
    output: "source",
});

