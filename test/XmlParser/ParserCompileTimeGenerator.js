// @preval
const fs = require("fs");
const path = require("path");

const nearley = require("nearley");
const compile = require("nearley/lib/compile");
const generate = require("nearley/lib/generate");
const nearleyGrammar = require("nearley/lib/nearley-language-bootstrapped");

function compileGrammar(sourceCode) {
    const grammarParser = new nearley.Parser(nearleyGrammar);
    grammarParser.feed(sourceCode);
    const grammarAst = grammarParser.results[0]; // TODO check for errors
    const grammarInfoObject = compile(grammarAst, {});
    const grammarJs = generate(grammarInfoObject, "grammar");
    return grammarJs;
    // const module = { exports: {} };
    // eval(grammarJs);
    // return module.exports;
}

const grammar = compileGrammar(fs.readFileSync(path.join("test", "XmlParser", "Grammar", "XmlGrammar.ne"), "utf8"));
module.exports = grammar;
// export default new nearley.Parser(nearley.Grammar.fromCompiled(grammar));

