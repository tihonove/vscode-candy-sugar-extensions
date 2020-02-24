import { AttributeType, AttributeTypeKind } from "./SugarElementInfo";

export class AttributeTypeUtils {
    public static valueTypeToString(attributeType: AttributeType): string {
        switch (attributeType.type) {
            case AttributeTypeKind.Boolean:
                return "boolean";
                break;
            case AttributeTypeKind.Number:
                return "number";
                break;
            case AttributeTypeKind.Path:
                return "DataPath";
                break;
            case AttributeTypeKind.String:
                return "string";
                break;
            case AttributeTypeKind.Type:
                return "Type";
                break;
            case AttributeTypeKind.VisibilityPath:
                return "DataPath";
                break;
            case AttributeTypeKind.FunctionName:
                return "Function name";
                break;
            case AttributeTypeKind.CssClassName:
                return "CssClassName";
                break;
            case AttributeTypeKind.PicklistId:
                return "PicklistId";
                break;
            case AttributeTypeKind.JavaScriptLiteral:
                return "JavaScriptLiteral";
                break;
            case AttributeTypeKind.Enum:
                return "Enum";
                break;
            case AttributeTypeKind.Color:
                return "Color";
                break;
            case AttributeTypeKind.PathList:
                return "PathList";
                break;
            case AttributeTypeKind.TemplateParameterType:
                return "TemplateParameterType";
                break;
            default:
                const fallbackAttributeValue: never = attributeType;
                return fallbackAttributeValue;
                break;
        }
    }
}
