export interface DataSchemaAttribute {
    name: string;
}

export interface DataSchemaNode {
    name: string;
    multiple?: boolean;
    attributes?: DataSchemaAttribute[];
    children?: DataSchemaNode[];
}
