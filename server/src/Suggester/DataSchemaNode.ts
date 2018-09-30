export interface DataSchemaAttribute {
    name: string;
}

export interface DataSchemaNode {
    name: string;
    multiple?: boolean;
    attributes?: DataSchemaAttribute[];
    children?: DataSchemaNode[];
    position: DataSchemaNodePosition;
}

export interface DataSchemaNodeLocation {
    line: number;
    column: number;
    offset: number;
}

export interface DataSchemaNodePosition {
    start: DataSchemaNodeLocation;
    end: DataSchemaNodeLocation;
}
