import { DataPath } from "../DataSchema/DataPathUtils";
import { SugarAttributeInfo, SugarElementInfo } from "../Suggester/SugarElementInfo";

import { SugarAttributeName, SugarAttributeValue, SugarElement, SugarElementName } from "./SugarGrammar/SugarParser";

export interface ElementNameCodeContext {
    type: "ElementName";
    contextNode: SugarElementName;
    currentElementInfo?: SugarElementInfo;
    elementStack: SugarElement[];
    dataContext: DataPath;
}

export interface AttributeNameCodeContext {
    type: "AttributeName";
    contextNode: SugarAttributeName;
    currentElementInfo?: SugarElementInfo;
    currentAttributeInfo?: SugarAttributeInfo;
    elementStack: SugarElement[];
    dataContext: DataPath;
}

interface DataAttributeValueCodeContext {
    type: "DataAttributeValue";
    contextNode: SugarAttributeValue;
    currentElementInfo?: SugarElementInfo;
    currentAttributeInfo?: SugarAttributeInfo;
    currentDataContext?: DataPath;
    elementStack: SugarElement[];
    dataContext: DataPath;
}

export type CodeContext = ElementNameCodeContext | AttributeNameCodeContext | DataAttributeValueCodeContext;
