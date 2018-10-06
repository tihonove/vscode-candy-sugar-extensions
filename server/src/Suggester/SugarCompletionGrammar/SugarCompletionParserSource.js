// @preval
const fs = require("fs");
const path = require("path");
const peg = require("pegjs");

module.exports = peg.generate(
    fs.readFileSync(path.join(__dirname, "SugarCompletion.pegjs"), "utf8"), {
    output: "source",
    trace: true,
});

