import { isNotNullOrUndefined, valueOrDefault } from "../Utils/TypingUtils";

import { CompletionContext, ElementContext } from "./ComletionClassificator";
import { SuggestionItem, SuggestionItemType } from "./CompletionSuggester";
import { DataSchemaAttribute, DataSchemaNode } from "./DataSchemaNode";
import { SugarElementInfo } from "./SugarElementInfo";

export class DataAttributeSuggester {
    private readonly pathSeparator: string = "/";
    private readonly sugarElementInfos: SugarElementInfo[];

    public constructor(sugarElementInfos: SugarElementInfo[]) {
        this.sugarElementInfos = sugarElementInfos;
    }

    public getScopePathByContext(root: DataSchemaNode, context: CompletionContext): string[] {
        if (context.elementContextStack == undefined) {
            return [];
        }
        const elementInfosStack: Array<[SugarElementInfo, ElementContext]> = context.elementContextStack
            .slice(0, -1)
            .map<[undefined | SugarElementInfo, ElementContext]>(x => [this.getElementInfoByContext(x), x])
            .map<undefined | [SugarElementInfo, ElementContext]>(([elementInfo, elementContext]) => {
                if (elementInfo == undefined) {
                    return undefined;
                }
                return [elementInfo, elementContext];
            })
            .filter(isNotNullOrUndefined);

        const result: string[] = [];
        let currentNode: undefined | DataSchemaNode = root;
        for (const [elementInfo, elementContext] of elementInfosStack) {
            const scopingPath = this.getScopingPath(elementInfo, elementContext);
            if (currentNode == undefined) {
                return [];
            }
            if (scopingPath != undefined) {
                currentNode = this.findElementByPath(currentNode, scopingPath.split(this.pathSeparator));
                result.push(...scopingPath.split(this.pathSeparator));
            }
        }
        return result;
    }

    public findCurrentRootByContext(root: DataSchemaNode, context: CompletionContext): undefined | DataSchemaNode {
        if (context.elementContextStack == undefined) {
            return root;
        }
        const elementInfosStack: Array<[SugarElementInfo, ElementContext]> = context.elementContextStack
            .slice(0, -1)
            .map<[undefined | SugarElementInfo, ElementContext]>(x => [this.getElementInfoByContext(x), x])
            .map<undefined | [SugarElementInfo, ElementContext]>(([elementInfo, elementContext]) => {
                if (elementInfo == undefined) {
                    return undefined;
                }
                return [elementInfo, elementContext];
            })
            .filter(isNotNullOrUndefined);

        let x: undefined | DataSchemaNode = root;
        for (const [elementInfo, elementContext] of elementInfosStack) {
            const scopingPath = this.getScopingPath(elementInfo, elementContext);
            if (x == undefined) {
                return undefined;
            }
            if (scopingPath != undefined) {
                x = this.findElementByPath(x, scopingPath.split(this.pathSeparator));
            }
        }
        return x;
    }

    public suggest(scopedPath: string[], root: DataSchemaNode, dataPathToCursor: string): SuggestionItem[] {
        const pathItems = dataPathToCursor.split(this.pathSeparator);
        const itemsWithoutLastItem = pathItems.slice(0, -1);
        const element = this.findElementByPath(root, itemsWithoutLastItem);
        if (element == undefined) {
            return [];
        }
        return [
            ...valueOrDefault<DataSchemaNode[]>(element.children, []).map<SuggestionItem>(x => ({
                type: SuggestionItemType.DataElement,
                name: x.name,
                fullPath: [...scopedPath, x.name],
            })),
            ...valueOrDefault<DataSchemaAttribute[]>(element.attributes, []).map<SuggestionItem>(x => ({
                type: SuggestionItemType.DataAttribute,
                name: x.name,
                fullPath: [...scopedPath, x.name],
            })),
        ];
    }

    private getScopingPath(elementInfo: SugarElementInfo, elementContext: ElementContext): undefined | string {
        if (!Boolean(elementInfo.createPathScope)) {
            return undefined;
        }
        if (elementContext.attributes == undefined) {
            return undefined;
        }
        const pathAttribute = elementContext.attributes.find(x => x.attributeName === "path");
        if (pathAttribute == undefined) {
            return undefined;
        }
        return pathAttribute.attributeValue;
    }

    private getElementInfoByContext(elementContext: ElementContext): undefined | SugarElementInfo {
        return this.sugarElementInfos.find(x => x.name === elementContext.elementName);
    }

    private findElementByPath(root: DataSchemaNode, itemsWithoutLastItem: string[]): undefined | DataSchemaNode {
        if (itemsWithoutLastItem.length === 0) {
            return root;
        } else {
            const nextNode =
                root.children != undefined ? root.children.find(x => x.name === itemsWithoutLastItem[0]) : undefined;
            if (nextNode == undefined) {
                return undefined;
            }
            return this.findElementByPath(nextNode, itemsWithoutLastItem.slice(1));
        }
    }
}
