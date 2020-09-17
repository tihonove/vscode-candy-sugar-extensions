import {
    AttributeType,
    AttributeTypeKind,
    AttributeTypes,
    AvailableChildrenType,
    SugarAttributeInfo,
    SugarElementAvailableChildrenInfo,
    SugarElementInfo,
} from "../SugarElementInfo";

import elementsFromGeneratorJson from "./CompileTimeDocumentationFromGeneratorSource";
import {
    AttributeTypeFromGenerator,
    AttributeTypeKindFromGenerator,
    AvailableChildrenTypeFromGenerator,
    SugarAttributeInfoFromGenerator,
    SugarElementAvailableChildrenInfoFromGenerator,
} from "./SugarElementInfoFromGenerator";

// tslint:disable-next-line no-unsafe-any
export const elementsFromGenerator: SugarElementInfo[] = elementsFromGeneratorJson.map(
    (element): SugarElementInfo => {
        const attributes = element.attributes ?? [];
        if (!attributes.some(x => x.name === "path")) {
            attributes.push({
                name: "path",
                valueTypes: [
                    {
                        type: AttributeTypeKindFromGenerator.Path,
                    },
                ],
                deprecated: false,
                markdownDescription: "Путь в схеме",
                shortMarkdownDescription: undefined,
                required: false,
            });
        }
        return {
            name: element.name,
            createPathScope: true,
            attributes: attributes.map(attributeFromGenerator),
            availableChildren: availableChildrenFromGenerator(element.availableChildren),
            markdownDescription: element.markdownDescription,
            shortMarkdownDescription: element.shortMarkdownDescription,
            verified: element.verified,
        };
    }
);

function attributeFromGenerator(x: SugarAttributeInfoFromGenerator): SugarAttributeInfo {
    return {
        name: x.name,
        valueTypes: x.name === "path" ? [AttributeTypes.Path] : x.valueTypes.map(attributeTypeFromGenerator),
        markdownDescription: x.markdownDescription,
        shortMarkdownDescription: x.shortMarkdownDescription,
        defaultValue: x.defaultValue,
        required: x.required,
        deprecated: x.deprecated,
    };
}

function attributeTypeFromGenerator(x: AttributeTypeFromGenerator): AttributeType {
    switch (x.type) {
        case AttributeTypeKindFromGenerator.Enum:
            return { type: AttributeTypeKind.Enum, values: x.values };
        case AttributeTypeKindFromGenerator.Path:
            return AttributeTypes.Path;
        case AttributeTypeKindFromGenerator.VisibilityPath:
            return AttributeTypes.VisibilityPath;
        case AttributeTypeKindFromGenerator.Type:
            return AttributeTypes.Type;
        case AttributeTypeKindFromGenerator.String:
            return AttributeTypes.String;
        case AttributeTypeKindFromGenerator.Number:
            return AttributeTypes.Number;
        case AttributeTypeKindFromGenerator.Boolean:
            return AttributeTypes.Boolean;
        case AttributeTypeKindFromGenerator.FunctionName:
            return AttributeTypes.FunctionName;
        case AttributeTypeKindFromGenerator.CssClassName:
            return AttributeTypes.CssClassName;
        case AttributeTypeKindFromGenerator.PicklistId:
            return AttributeTypes.PicklistId;
        case AttributeTypeKindFromGenerator.JavaScriptLiteral:
            return AttributeTypes.JavaScriptLiteral;
        case AttributeTypeKindFromGenerator.Color:
            return AttributeTypes.Color;
        case AttributeTypeKindFromGenerator.PathList:
            return AttributeTypes.PathList;
        case AttributeTypeKindFromGenerator.TemplateParameterType:
            return AttributeTypes.TemplateParameterType;
        default:
            return x;
    }
}

function availableChildrenFromGenerator(
    x: SugarElementAvailableChildrenInfoFromGenerator
): SugarElementAvailableChildrenInfo {
    switch (x.type) {
        case AvailableChildrenTypeFromGenerator.Any:
            return { type: AvailableChildrenType.Any };
            break;
        case AvailableChildrenTypeFromGenerator.NoChildren:
            return { type: AvailableChildrenType.NoChildren };
            break;
        case AvailableChildrenTypeFromGenerator.TextOnly:
            return { type: AvailableChildrenType.TextOnly };
            break;
        case AvailableChildrenTypeFromGenerator.List:
            return { type: AvailableChildrenType.List, list: x.list };
            break;
        default:
            return x;
    }
}
