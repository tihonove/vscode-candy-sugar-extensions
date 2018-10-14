import { CodePosition } from "../Utils/PegJSUtils/Types";

export type DataSchemaNode = DataSchemaAttribute | DataSchemaElementNode;

export interface DataSchemaAttribute {
    type: "DataSchemaAttribute";
    name: string;
    description?: string;
    position: CodePosition;
}

export interface DataSchemaElementNode {
    type: "DataSchemaElementNode";
    name: string;
    multiple?: boolean;
    attributes?: DataSchemaAttribute[];
    children?: DataSchemaElementNode[];
    position: CodePosition;
    description?: string;
}
