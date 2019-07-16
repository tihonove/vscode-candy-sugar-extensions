import { CodeLens, Location, Range } from "vscode-languageserver-types";

import {
    SugarAttribute,
    SugarAttributeName,
    SugarAttributeValue,
    SugarElement,
    SugarElementName,
    SugarJavaScriptLiteral,
} from "../SugarParsing/SugarGrammar/SugarParser";
import { oc } from "../Utils/ChainWrapper";
import { CodePosition } from "../Utils/PegJSUtils/Types";
import { UriUtils } from "../Utils/UriUtils";

export interface IUsagesGroup<T = {}, U = {}> {
    source: T & { position: CodePosition };
    usages: Array<U & IUsagesRequiredFields>;
}

export interface IUsagesRequiredFields {
    absoluteSugarFilePath: string;
    elementPosition: CodePosition;
}

export class ReferencesBuilder {
    public getCodeLenses(usagesGroups: IUsagesGroup[]): undefined | CodeLens[] {
        const lenses = usagesGroups;
        if (lenses.length === 0) {
            return undefined;
        }
        return lenses.map<CodeLens>(x => ({
            range: this.pegjsPositionToVsCodeRange(x.source.position),
            command: {
                command: x.usages.length > 0 ? "vscode-candy-sugar.open-usages-at-offset" : "",
                title: x.usages.length === 1 ? `1 usage` : `${x.usages.length} usages`,
                arguments: [x.source.position.start.offset + 1],
            },
        }));
    }

    protected getValueAttributeByName(
        element: undefined | SugarElement,
        attributeName: string
    ): undefined | SugarJavaScriptLiteral | string {
        return oc(element)
            .with(x => x.attributes)
            .with(x => x.find(x => x.name.value === attributeName))
            .with(x => x.value)
            .with(x => x.value)
            .return(x => x, undefined);
    }

    protected findNearestElementByName(
        contextNode: SugarAttribute | SugarElement | SugarElementName | SugarAttributeName | SugarAttributeValue,
        elementName: string
    ): undefined | SugarElement {
        if (contextNode.type === "Element" && contextNode.name.value === elementName) {
            return contextNode;
        }
        if (contextNode.parent == undefined) {
            return undefined;
        }
        return this.findNearestElementByName(contextNode.parent, elementName);
    }

    protected mapUsages(usages: IUsagesRequiredFields[]): Location[] {
        return usages.map(x => ({
            uri: UriUtils.fileNameToUri(x.absoluteSugarFilePath),
            range: this.pegjsPositionToVsCodeRange(x.elementPosition),
        }));
    }

    protected pegjsPositionToVsCodeRange(position: CodePosition): Range {
        return {
            start: {
                character: position.start.column - 1,
                line: position.start.line - 1,
            },
            end: {
                character: position.end.column - 1,
                line: position.end.line - 1,
            },
        };
    }
}
