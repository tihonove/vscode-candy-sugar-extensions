import { DataPathUtils } from "../DataSchema/DataPathUtils";
import { AttributeType, SugarElementInfo } from "../SugarElements/SugarElementInfo";
import { SugarElement } from "../SugarParsing/SugarGrammar/SugarParser";

import { CodeContext } from "./CodeContext";
import { NodeWithDefinition } from "./OffsetToNodeMaping/OffsetToNodeMapBuilder";

export class CodeContextByNodeResolver {
    private readonly sugarElementInfos: SugarElementInfo[];

    public constructor(sugarElementInfos: SugarElementInfo[]) {
        this.sugarElementInfos = sugarElementInfos;
    }

    public resolveContext(node: NodeWithDefinition): undefined | CodeContext {
        if (node == undefined) {
            return undefined;
        }
        if (node.type === "ElementName") {
            const elementStack = this.buildElementStack(node.parent);
            const currentElementInfo = this.resolveSugarElementInfo([...elementStack]);
            return {
                type: "ElementName",
                contextNode: node,
                currentElementInfo: currentElementInfo,
                elementStack: elementStack,
                dataContext: DataPathUtils.normalizeDataPath(this.resolveDataContext(this.withoutLast(elementStack))),
            };
        }
        if (node.type === "AttributeName") {
            const elementStack = this.buildElementStack(node.parent.parent);
            const currentElementInfo = this.resolveSugarElementInfo([...elementStack]);
            const currentAttributeInfo =
                currentElementInfo == undefined || currentElementInfo.attributes == undefined
                    ? undefined
                    : currentElementInfo.attributes.find(x => x.name === node.value);
            return {
                type: "AttributeName",
                contextNode: node,
                currentElementInfo: currentElementInfo,
                currentAttributeInfo: currentAttributeInfo,
                elementStack: elementStack,
                dataContext: DataPathUtils.normalizeDataPath(this.resolveDataContext(this.withoutLast(elementStack))),
            };
        }
        if (node.type === "AttributeValue") {
            const elementStack = this.buildElementStack(node.parent.parent);
            const currentElementInfo = this.resolveSugarElementInfo([...elementStack]);
            const currentAttributeInfo =
                currentElementInfo == undefined || currentElementInfo.attributes == undefined
                    ? undefined
                    : currentElementInfo.attributes.find(x => x.name === node.parent.name.value);
            const dataContext = this.resolveDataContext(this.withoutLast(elementStack));
            if (
                currentAttributeInfo == undefined ||
                currentAttributeInfo.valueTypes == undefined ||
                !currentAttributeInfo.valueTypes.includes(AttributeType.Path)
            ) {
                return {
                    type: "AttributeValue",
                    contextNode: node,
                    currentElementInfo: currentElementInfo,
                    currentAttributeInfo: currentAttributeInfo,
                    elementStack: elementStack,
                    dataContext: DataPathUtils.normalizeDataPath(dataContext),
                };
            }
            return {
                type: "DataAttributeValue",
                contextNode: node,
                currentElementInfo: currentElementInfo,
                currentAttributeInfo: currentAttributeInfo,
                currentDataContext: DataPathUtils.normalizeDataPath(
                    DataPathUtils.joinDataPaths(dataContext, this.parseDataAttributeValue(node.value))
                ),
                elementStack: elementStack,
                dataContext: DataPathUtils.normalizeDataPath(dataContext),
            };
        }
        return undefined;
    }

    private withoutLast<T>(items: T[]): T[] {
        return items.slice(0, -1);
    }

    private resolveSugarElementInfo(elementStack: SugarElement[]): undefined | SugarElementInfo {
        const lastElement = elementStack[elementStack.length - 1];
        if (lastElement == undefined) {
            return undefined;
        }
        return this.sugarElementInfos.find(x => x.name === lastElement.name.value);
    }

    private resolveDataContext(elementStack: SugarElement[]): string[] {
        let result: string[] = [];
        for (let i = 0; i < elementStack.length; i++) {
            const sugarElementInfo = this.resolveSugarElementInfo(elementStack.slice(0, i + 1));
            if (sugarElementInfo == undefined || !sugarElementInfo.createPathScope) {
                continue;
            }
            const sugarAttributes = elementStack[i].attributes;
            if (sugarAttributes == undefined) {
                continue;
            }
            const pathAttribute = sugarAttributes.find(x => x.name.value === "path");
            if (pathAttribute == undefined || pathAttribute.value == undefined) {
                continue;
            }
            result = DataPathUtils.joinDataPaths(result, this.parseDataAttributeValue(pathAttribute.value.value));
        }
        return result;
    }

    private parseDataAttributeValue(pathAttributeValue: string): string[] {
        return DataPathUtils.parseDataAttributeValue(pathAttributeValue);
    }

    private buildElementStack(node: undefined | SugarElement): SugarElement[] {
        const result: SugarElement[] = [];
        let currentElement = node;
        while (currentElement != undefined) {
            result.push(currentElement);
            currentElement = currentElement.parent;
        }
        return result.reverse();
    }
}
