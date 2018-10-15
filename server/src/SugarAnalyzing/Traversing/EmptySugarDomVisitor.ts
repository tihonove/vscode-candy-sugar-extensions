import {
    SugarAttribute,
    SugarAttributeName,
    SugarElement,
    SugarElementName,
} from "../../SugarParsing/SugarGrammar/SugarParser";

import { ISugarDomVisitor } from "./ISugarDomVisitor";

export class EmptySugarDomVisitor implements ISugarDomVisitor {
    public visitAttribute(_attribute: SugarAttribute): void {
        // empty implementation
    }

    public visitAttributeName(_attributeName: SugarAttributeName): void {
        // empty implementation
    }

    public visitElement(_element: SugarElement): void {
        // empty implementation
    }

    public visitElementName(_elementName: SugarElementName): void {
        // empty implementation
    }

    public enterElement(_element: SugarElement): void {
        // empty implementation
    }

    public exitElement(_element: SugarElement): void {
        // empty implementation
    }
}
