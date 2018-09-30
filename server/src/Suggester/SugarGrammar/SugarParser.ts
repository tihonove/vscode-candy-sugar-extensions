import { IPegJSTracer } from "../../PegJSTypes/PegJSTypes";

// @ts-ignore
import source from "./SugarParserSource";

// tslint:disable-next-line no-eval no-unsafe-any
const evalParse: (input: string, options: { tracer?: IPegJSTracer }) => void = eval(source).parse;

export const parse = evalParse;
