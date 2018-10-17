import { CodePosition } from "../Utils/PegJSUtils/Types";

export enum TypeKind {
    UserDefined,
    BuiltIn,
}

export interface UserDefinedSugarTypeInfo {
    name: string;
    baseName?: string;
    description?: string;
    requiredDescription?: string;
    constraintStrings: string[];
    position: CodePosition;
}

export const defaultBuiltInTypeNames = ["string", "pattern", "integer", "decimal", "date", "gYear"];
