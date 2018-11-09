import { DataSchemaElementNode } from "../../DataSchema/DataSchemaNode";
import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";

export interface ISugarProjectContext {
    getAllUserDefinedTypes(): UserDefinedSugarTypeInfo[];
    getDataSchema(): undefined | DataSchemaElementNode;
    getSugarElementInfos(): SugarElementInfo[];
    getAllProjectFilePaths(): string[];
    getSugarDomByFilePath(absoluteSugarFilePath: string): SugarElement;
}
