export interface DataSchemaAttribute {
    name: string;
    description?: string;
}

export interface DataSchemaNode {
    name: string;
    multiple?: boolean;
    attributes?: DataSchemaAttribute[];
    children?: DataSchemaNode[];
    position: DataSchemaNodePosition;
    description?: string;
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
