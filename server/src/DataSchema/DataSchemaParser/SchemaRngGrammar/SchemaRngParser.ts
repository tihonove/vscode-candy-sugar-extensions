// @ts-ignore
import source from "./SchemaRngParserSource";

// tslint:disable-next-line no-eval no-unsafe-any
const evalParse: SchemaRngParseFunction = eval(source).parse;

export interface SchemaRngDocument {
    preamble: SchemaRngPreamble;
    body: SchemaRngNode;
    position: Position;
}

export interface SchemaRngNode {
    name: string;
    attributes?: SchemaRngNodeAttributeList;
    children?: SchemaRngNode[];
    position: Position;
}

export interface SchemaRngNodeAttributeList {
    [name: string]: string;
}

export interface Location {
    line: number;
    column: number;
    offset: number;
}

export interface Position {
    start: Location;
    end: Location;
}

export interface SchemaRngPreamble {
    type: "preamble";
    position: Position;
}

export type SchemaRngParseFunction = (input: string) => SchemaRngDocument;

export const parse = evalParse;
