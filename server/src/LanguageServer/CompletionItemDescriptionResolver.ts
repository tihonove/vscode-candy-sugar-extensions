import { CompletionItem } from "vscode-languageserver-types";

import { DataSchemaElementNode } from "../DataSchema/DataSchemaNode";
import { DataSchemaUtils } from "../DataSchema/DataSchemaUtils";
import { SuggestionItem, SuggestionItemType } from "../SugarAnalyzing/CompletionSuggester";
import { allElements } from "../SugarElements/DefaultSugarElementInfos/DefaultSugarElements";

import { MarkdownUtils } from "./MarkdownUtils";

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
                        vsCodeCompletionItem.detail = MarkdownUtils.buildAttributeHeader(attributeInfo);
                        vsCodeCompletionItem.documentation = MarkdownUtils.buildAttributeDetails(
                            elementInfo,
                            attributeInfo,
                            { appendHeader: false }
                        );
                    }
                }
            }
        }

        if (suggestionItem.type === SuggestionItemType.DataElement) {
            const dataSchemaNode = DataSchemaUtils.findElementByPath(this.dataSchemaRootNode, suggestionItem.fullPath);
            if (dataSchemaNode == undefined) {
                return;
            }
            vsCodeCompletionItem.detail = `<element name="${dataSchemaNode.name}">`;
            if (dataSchemaNode.description != undefined) {
                vsCodeCompletionItem.documentation = MarkdownUtils.buildDataSchemaElementDetail(
                    undefined,
                    undefined,
                    dataSchemaNode,
                    { appendHeader: false }
                );
            }
        }

        if (suggestionItem.type === SuggestionItemType.DataAttribute) {
            const dataSchemaAttribute = DataSchemaUtils.findAttributeByPath(
                this.dataSchemaRootNode,
                suggestionItem.fullPath
            );
            if (dataSchemaAttribute == undefined) {
                return;
            }
            vsCodeCompletionItem.detail = `<attribute name="${dataSchemaAttribute.name}">`;
            if (dataSchemaAttribute.description != undefined) {
                vsCodeCompletionItem.documentation = MarkdownUtils.buildDataSchemaAttributeDetail(
                    undefined,
                    undefined,
                    dataSchemaAttribute,
                    { appendHeader: false }
                );
            }
        }
    }
}
