import source from "./SugarParserSource";

const { parse: evalParse } = eval(source);

export const parse = evalParse;
