import { MarkupContent, MarkupKind } from "vscode-languageserver-types";

import { SugarElementInfo } from "./Suggester/SugarElementInfo";
import { isNotNullOrUndefined } from "./Utils/TypingUtils";

interface ElementDetailsOptions {
    appendHeader?: boolean;
}

export class MarkdownUtils {
    public static buildElementDetails(
        sugarElementInfo: undefined | SugarElementInfo,
        options: ElementDetailsOptions = { appendHeader: true }
    ): undefined | MarkupContent {
        if (sugarElementInfo == undefined) {
            return undefined;
        }
        let attributesLines: string[] = [];
        if (sugarElementInfo.attributes != undefined && sugarElementInfo.attributes.length > 0) {
            attributesLines = [
                "",
                "*Атрибуты*",
                ...sugarElementInfo.attributes.map(
                    x => `* \`${x.name}\` ${x.shortMarkdownDescription || x.markdownDescription || ""}`
                ),
            ];
        }
        const headerLines = options.appendHeader ? ["```xml", `<${sugarElementInfo.name}>`, "```"] : [];
        return {
            kind: MarkupKind.Markdown,
            value: [...headerLines, sugarElementInfo.markdownDescription, ...attributesLines]
                .filter(isNotNullOrUndefined)
                .join("\n"),
        };
    }
}
