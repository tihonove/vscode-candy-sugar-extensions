import { CompletionItem } from "vscode-languageserver-types";

import { allElements } from "./SugarElements/DefaultSugarElements";
import { CompletionSuggester, SuggestionItem, SuggestionItemType } from "./Suggester/CompletionSuggester";
import { DataSchemaNode } from "./Suggester/DataSchemaNode";
import { AttributeType } from "./Suggester/SugarElementInfo";

export class SugarDocumentServices {
    public suggester: CompletionSuggester;
    public descriptionResolver: CompletionItemDescriptionResolver;

    public constructor(dataSchemaRootNode: DataSchemaNode) {
        this.suggester = new CompletionSuggester([], allElements, dataSchemaRootNode);
        this.descriptionResolver = new CompletionItemDescriptionResolver();
    }
}

class CompletionItemDescriptionResolver {
    public enrichCompletionItem(vsCodeCompletionItem: CompletionItem, suggestionItem: SuggestionItem): void {
        if (suggestionItem.type === SuggestionItemType.Element) {
            const elementInfo = allElements.find(x => x.name === suggestionItem.name);
            if (elementInfo != undefined) {
                if (elementInfo.attributes != undefined && elementInfo.attributes.length > 0) {
                    vsCodeCompletionItem.detail = `<${elementInfo.name} ... />`;
                } else {
                    vsCodeCompletionItem.detail = `<${elementInfo.name} />`;
                }
                if (elementInfo.markdownDescription != undefined) {
                    vsCodeCompletionItem.documentation = {
                        kind: "markdown",
                        value: elementInfo.markdownDescription,
                    };
                }
            }
        }

        if (suggestionItem.type === SuggestionItemType.Attribute) {
            const elementInfo = allElements.find(x => x.name === suggestionItem.parentElementName);
            if (elementInfo != undefined) {
                if (elementInfo.attributes != undefined && elementInfo.attributes.length > 0) {
                    const attributeInfo = elementInfo.attributes.find(x => x.name === suggestionItem.name);
                    if (attributeInfo != undefined) {
                        vsCodeCompletionItem.detail = attributeInfo.valueTypes
                            .map(x => this.valueTypeToString(x))
                            .join(" | ");
                        if (attributeInfo.markdownDescription != undefined) {
                            vsCodeCompletionItem.documentation = {
                                kind: "markdown",
                                value: attributeInfo.markdownDescription,
                            };
                        }
                    }
                }
            }
        }
    }

    private valueTypeToString(attributeType: AttributeType): string {
        switch (attributeType) {
            case AttributeType.Boolean:
                return "boolean";
                break;
            case AttributeType.Number:
                return "number";
                break;
            case AttributeType.Path:
                return "DataPath";
                break;
            case AttributeType.String:
                return "string";
                break;
            case AttributeType.Type:
                return "Type";
                break;
            default:
                return "any";
                break;
        }
    }
}
