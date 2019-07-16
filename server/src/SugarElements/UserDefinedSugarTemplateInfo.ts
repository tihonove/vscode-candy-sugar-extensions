import { CodePosition } from "../Utils/PegJSUtils/Types";

export interface UserDefinedSugarTemplateInfo {
    name: string;
    templateName?: string;
    baseName?: string;
    description?: string;
    requiredDescription?: string;
    constraintStrings: string[];
    position: CodePosition;
    absoluteSugarFilePath?: string;
}
