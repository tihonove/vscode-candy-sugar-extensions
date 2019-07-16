import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { UserDefinedSugarTemplateInfo } from "../../SugarElements/UserDefinedSugarTemplateInfo";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
import { traverseSugar } from "../Traversing/TraverseSugar";

import { TemplateElementsExtractionVisitor } from "./TemplateElementsExtractionVisitor";
import { TemplateInfoExtractionVisitor } from "./TemplateInfoExtractionVisitor";

export class TemplatesExtractor {
    public extractElements(documentRootNode: SugarElement): SugarElementInfo[] {
        const extractionVisitor = new TemplateElementsExtractionVisitor();
        traverseSugar(documentRootNode, extractionVisitor);
        return extractionVisitor.getTemplatesElementInfos();
    }

    public extractTemplates(documentRootNode: SugarElement, absolutePath?: string): UserDefinedSugarTemplateInfo[] {
        const extractionVisitor = new TemplateInfoExtractionVisitor(absolutePath);
        traverseSugar(documentRootNode, extractionVisitor);
        return extractionVisitor.getSourceTemplatesElementInfos();
    }
}
