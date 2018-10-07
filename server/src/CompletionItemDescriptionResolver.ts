import { CompletionItem } from "vscode-languageserver-types";

import { DataSchemaElementNode } from "./DataSchema/DataSchemaNode";
import { DataSchemaUtils } from "./DataSchema/DataSchemaUtils";
import { MarkdownUtils } from "./MarkdownUtils";
import { allElements } from "./SugarElements/DefaultSugarElements";
import { SuggestionItem, SuggestionItemType } from "./Suggester/CompletionSuggester";
import { AttributeType } from "./Suggester/SugarElementInfo";

export class CompletionItemDescriptionResolver {
    private readonly dataSchemaRootNode: DataSchemaElementNode;

    public constructor(dataSchemaRootNode: DataSchemaElementNode) {
        this.dataSchemaRootNode = dataSchemaRootNode;
    }

    public enrichCompletionItem(vsCodeCompletionItem: CompletionItem, suggestionItem: SuggestionItem): void {
        if (suggestionItem.type === SuggestionItemType.Element) {
            const elementInfo = allElements.find(x => x.name === suggestionItem.name);

            if (elementInfo != undefined) {
                if (elementInfo.attributes != undefined && elementInfo.attributes.length > 0) {
                    vsCodeCompletionItem.detail = `<${elementInfo.name} ... />`;
                } else {
                    vsCodeCompletionItem.detail = `<${elementInfo.name} />`;
                }
                const documentation = MarkdownUtils.buildElementDetails(elementInfo, { appendHeader: false });
                if (documentation != undefined) {
                    vsCodeCompletionItem.documentation = documentation;
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

        if (suggestionItem.type === SuggestionItemType.DataElement) {
            const dataSchemaNode = DataSchemaUtils.findElementByPath(this.dataSchemaRootNode, suggestionItem.fullPath);
            if (dataSchemaNode == undefined) {
                return;
            }
            vsCodeCompletionItem.detail = "{ ... }";
            if (dataSchemaNode.description != undefined) {
                vsCodeCompletionItem.documentation = {
                    kind: "markdown",
                    value: dataSchemaNode.description,
                };
            }
        }

        if (suggestionItem.type === SuggestionItemType.DataAttribute) {
            const dataSchemaAttribute = DataSchemaUtils.findAttributeByPath(
                this.dataSchemaRootNode,
                suggestionItem.fullPath
            );
            vsCodeCompletionItem.detail = "<>";
            if (dataSchemaAttribute == undefined) {
                return;
            }
            if (dataSchemaAttribute.description != undefined) {
                vsCodeCompletionItem.documentation = {
                    kind: "markdown",
                    value: dataSchemaAttribute.description,
                };
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
