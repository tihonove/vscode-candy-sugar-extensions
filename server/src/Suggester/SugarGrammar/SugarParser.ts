// @ts-ignore
import source from "./SugarParserSource";

// tslint:disable-next-line no-eval
const { parse: evalParse } = eval(source);

export const parse = evalParse;
