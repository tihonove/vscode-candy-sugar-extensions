import { IPegJSTracer } from "../../PegJSUtils/Types";

// @ts-ignore
import source from "./SugarCompletionParserSource";

// tslint:disable-next-line no-eval no-unsafe-any
const evalParse: (input: string, options: { tracer?: IPegJSTracer }) => void = eval(source).parse;

export const parseSugar = evalParse;
