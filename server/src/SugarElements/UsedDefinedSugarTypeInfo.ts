import { CodePosition } from "../Utils/PegJSUtils/Types";

export interface UsedDefinedSugarTypeInfo {
    name: string;
    baseName?: string;
    description?: string;
    requiredDescription?: string;
    constraintStrings: string[];
    position: CodePosition;
}
