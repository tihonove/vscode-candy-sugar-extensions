export enum AttributeTypeKind {
    Path = "Path",
    VisibilityPath = "VisibilityPath",
    Type = "Type",
    String = "String",
    Number = "Number",
    Boolean = "Boolean",
    FunctionName = "FunctionName",
    CssClassName = "CssClassName",
    PicklistId = "PicklistId",
    JavaScriptLiteral = "JavaScriptLiteral",
    Enum = "Enum",
    Color = "Color",
    PathList = "PathList",
    TemplateParameterType = "TemplateParameterType",
}

export type AttributeType =
    | {
          type: Exclude<AttributeTypeKind, AttributeTypeKind.Enum>;
      }
    | {
          type: AttributeTypeKind.Enum;
          values: string[];
      };

export class AttributeTypes {
    public static Path: AttributeType = { type: AttributeTypeKind.Path };
    public static VisibilityPath: AttributeType = { type: AttributeTypeKind.VisibilityPath };
    public static Type: AttributeType = { type: AttributeTypeKind.Type };
    public static String: AttributeType = { type: AttributeTypeKind.String };
    public static Number: AttributeType = { type: AttributeTypeKind.Number };
    public static Boolean: AttributeType = { type: AttributeTypeKind.Boolean };
    public static FunctionName: AttributeType = { type: AttributeTypeKind.FunctionName };
    public static CssClassName: AttributeType = { type: AttributeTypeKind.CssClassName };
    public static PicklistId: AttributeType = { type: AttributeTypeKind.PicklistId };
    public static JavaScriptLiteral: AttributeType = { type: AttributeTypeKind.JavaScriptLiteral };
    public static Color: AttributeType = { type: AttributeTypeKind.Color };
    public static PathList: AttributeType = { type: AttributeTypeKind.PathList };
    public static TemplateParameterType: AttributeType = { type: AttributeTypeKind.TemplateParameterType };
}

export enum AvailableChildrenType {
    NoChildren = "NoChildren",
    Any = "Any",
    TextOnly = "TextOnly",
    List = "List",
}

export interface SugarAttributeInfo {
    name: string;
    valueTypes: AttributeType[];
    markdownDescription?: string;
    shortMarkdownDescription?: string;
    defaultValue?: string;
    required?: boolean;
    deprecated?: boolean;
}

export type SugarElementAvailableChildrenInfo =
    | {
          type: AvailableChildrenType.Any;
      }
    | {
          type: AvailableChildrenType.NoChildren;
      }
    | {
          type: AvailableChildrenType.TextOnly;
      }
    | {
          type: AvailableChildrenType.List;
          list: string[];
      };

export interface SugarElementInfo {
    name: string;
    createPathScope?: boolean;
    attributes?: SugarAttributeInfo[];
    availableChildren: SugarElementAvailableChildrenInfo;
    markdownDescription?: string;
    definedType?: SugarElementDefinedType;
    verified?: boolean;
}

export enum TemplateParameterType {
    String = "string",
    Sugar = "sugar",
}

export enum SugarElementDefinedType {
    Template,
}
