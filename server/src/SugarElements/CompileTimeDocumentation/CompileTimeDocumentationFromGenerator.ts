import {
    AttributeType,
    AvailableChildrenType,
    SugarAttributeInfo,
    SugarElementAvailableChildrenInfo,
    SugarElementInfo
} from "../SugarElementInfo";

import elementsFromGeneratorJson from "./CompileTimeDocumentationFromGeneratorSource";
import {
    AttributeTypeFromGenerator,
    AvailableChildrenTypeFromGenerator,
    SugarAttributeInfoFromGenerator,
    SugarElementAvailableChildrenInfoFromGenerator,
} from "./SugarElementInfoFromGenerator";

// tslint:disable-next-line no-unsafe-any
export const elementsFromGenerator: SugarElementInfo[] = elementsFromGeneratorJson.map(
    (element): SugarElementInfo => ({
        name: element.name,
        createPathScope: element.createPathScope,
        attributes: element.attributes?.map(attributeFromGenerator),
        availableChildren: availableChildrenFromGenerator(element.availableChildren),
        markdownDescription: element.markdownDescription,
        verified: element.verified,
    })
);

function attributeFromGenerator(x: SugarAttributeInfoFromGenerator): SugarAttributeInfo {
    return {
        name: x.name,
        valueTypes: x.valueTypes.map(attributeTypeFromGenerator),
        markdownDescription: x.markdownDescription,
        shortMarkdownDescription: x.shortMarkdownDescription,
        defaultValue: x.defaultValue,
        required: x.required,
        deprecated: x.deprecated,
    };
}

function attributeTypeFromGenerator(x: AttributeTypeFromGenerator): AttributeType {
    switch (x) {
        case AttributeTypeFromGenerator.Path:
            return AttributeType.Path;
        case AttributeTypeFromGenerator.VisibilityPath:
            return AttributeType.VisibilityPath;
        case AttributeTypeFromGenerator.Type:
            return AttributeType.Type;
        case AttributeTypeFromGenerator.String:
            return AttributeType.String;
        case AttributeTypeFromGenerator.Number:
            return AttributeType.Number;
        case AttributeTypeFromGenerator.Boolean:
            return AttributeType.Boolean;
        case AttributeTypeFromGenerator.FunctionName:
            return AttributeType.FunctionName;
        case AttributeTypeFromGenerator.CssClassName:
            return AttributeType.CssClassName;
        case AttributeTypeFromGenerator.PicklistId:
            return AttributeType.PicklistId;
        case AttributeTypeFromGenerator.JavaScriptLiteral:
            return AttributeType.JavaScriptLiteral;
        case AttributeTypeFromGenerator.Enum:
            return AttributeType.Enum;
        case AttributeTypeFromGenerator.Color:
            return AttributeType.Color;
        case AttributeTypeFromGenerator.PathList:
            return AttributeType.PathList;
        case AttributeTypeFromGenerator.TemplateParameterType:
            return AttributeType.TemplateParameterType;
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
