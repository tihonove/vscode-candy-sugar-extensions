import { UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
import { traverseSugar } from "../Traversing/TraverseSugar";

import { TypeInfoExtractionVisitor } from "./TypeInfoExtractionVisitor";

export class TypeInfoExtractor {
    public extractTypeInfos(documentRootNode: SugarElement): UserDefinedSugarTypeInfo[] {
        const extractionVisitor = new TypeInfoExtractionVisitor();
        traverseSugar(documentRootNode, extractionVisitor);
        return extractionVisitor.getTypeInfos();
    }
}
