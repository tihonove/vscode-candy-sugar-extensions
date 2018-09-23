// @preval
const fs = require("fs");
const path = require("path");
const peg = require("pegjs");

module.exports = peg.generate(fs.readFileSync(path.join("server", "src", "Suggester", "SugarGrammar", "Sugar.pegjs"), "utf8"), {
    output: "source",
    trace: true,
});

