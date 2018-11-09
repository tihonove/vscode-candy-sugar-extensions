import { UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
import { traverseSugar } from "../Traversing/TraverseSugar";

import { TypeInfoExtractionVisitor } from "./TypeInfoExtractionVisitor";

export class TypeInfoExtractor {
    public extractTypeInfos(documentRootNode: SugarElement, absolutePath?: string): UserDefinedSugarTypeInfo[] {
        const extractionVisitor = new TypeInfoExtractionVisitor(absolutePath);
        traverseSugar(documentRootNode, extractionVisitor);
        return extractionVisitor.getTypeInfos();
    }
}
