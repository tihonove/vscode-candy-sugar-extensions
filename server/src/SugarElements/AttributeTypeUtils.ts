import { AttributeType } from "./SugarElementInfo";

export class AttributeTypeUtils {
    public static valueTypeToString(attributeType: AttributeType): string {
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
            case AttributeType.VisibilityPath:
                return "DataPath";
                break;
            case AttributeType.FunctionName:
                return "Function name";
                break;
            case AttributeType.CssClassName:
                return "CssClassName";
                break;
            case AttributeType.PicklistId:
                return "PicklistId";
                break;
            case AttributeType.JavaScriptLiteral:
                return "JavaScriptLiteral";
                break;
            case AttributeType.Enum:
                return "Enum";
                break;
            case AttributeType.Color:
                return "Color";
                break;
            case AttributeType.PathList:
                return "PathList";
                break;
            case AttributeType.TemplateParameterType:
                return "TemplateParameterType";
                break;
            default:
                const fallbackAttributeValue: never = attributeType;
                return fallbackAttributeValue;
                break;
        }
    }
}
