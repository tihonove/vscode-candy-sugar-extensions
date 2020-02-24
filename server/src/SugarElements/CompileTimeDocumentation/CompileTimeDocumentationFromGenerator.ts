import {
    AttributeType,
    AttributeTypes,
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
            return AttributeTypes.Path;
        case AttributeTypeFromGenerator.VisibilityPath:
            return AttributeTypes.VisibilityPath;
        case AttributeTypeFromGenerator.Type:
            return AttributeTypes.Type;
        case AttributeTypeFromGenerator.String:
            return AttributeTypes.String;
        case AttributeTypeFromGenerator.Number:
            return AttributeTypes.Number;
        case AttributeTypeFromGenerator.Boolean:
            return AttributeTypes.Boolean;
        case AttributeTypeFromGenerator.FunctionName:
            return AttributeTypes.FunctionName;
        case AttributeTypeFromGenerator.CssClassName:
            return AttributeTypes.CssClassName;
        case AttributeTypeFromGenerator.PicklistId:
            return AttributeTypes.PicklistId;
        case AttributeTypeFromGenerator.JavaScriptLiteral:
            return AttributeTypes.JavaScriptLiteral;
        case AttributeTypeFromGenerator.Enum:
            return AttributeTypes.String;
        case AttributeTypeFromGenerator.Color:
            return AttributeTypes.Color;
        case AttributeTypeFromGenerator.PathList:
            return AttributeTypes.PathList;
        case AttributeTypeFromGenerator.TemplateParameterType:
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
