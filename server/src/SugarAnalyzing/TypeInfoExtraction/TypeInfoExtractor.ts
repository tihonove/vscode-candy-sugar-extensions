import { UsedDefinedSugarTypeInfo } from "../../SugarElements/UsedDefinedSugarTypeInfo";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
import { traverseSugar } from "../Traversing/TraverseSugar";

import { TypeInfoExtractionVisitor } from "./TypeInfoExtractionVisitor";

export class TypeInfoExtractor {
    public extractTypeInfos(documentRootNode: SugarElement): UsedDefinedSugarTypeInfo[] {
        const extractionVisitor = new TypeInfoExtractionVisitor();
        traverseSugar(documentRootNode, extractionVisitor);
        return extractionVisitor.getTypeInfos();
    }
}
