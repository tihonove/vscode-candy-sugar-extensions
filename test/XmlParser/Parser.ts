import { Grammar, Parser } from "nearley";

import GeneratedGrammarString from "./ParserCompileTimeGenerator";

function getCompiledGrammar(): Grammar {
    const module: any = { exports: {} };
    // tslint:disable-next-line no-eval
    eval(GeneratedGrammarString);
    return Grammar.fromCompiled(module.exports);
}

export function createParser(): Parser {
    return new Parser(getCompiledGrammar());
}
