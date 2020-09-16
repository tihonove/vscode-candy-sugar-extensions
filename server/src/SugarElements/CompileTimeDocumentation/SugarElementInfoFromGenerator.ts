export enum AvailableChildrenTypeFromGenerator {
    NoChildren = "NoChildren",
    Any = "Any",
    TextOnly = "TextOnly",
    List = "List",
}

export type SugarElementAvailableChildrenInfoFromGenerator =
    | {
          type: AvailableChildrenTypeFromGenerator.Any;
      }
    | {
          type: AvailableChildrenTypeFromGenerator.NoChildren;
      }
    | {
          type: AvailableChildrenTypeFromGenerator.TextOnly;
      }
    | {
          type: AvailableChildrenTypeFromGenerator.List;
          list: string[];
      };

export enum AttributeTypeKindFromGenerator {
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

export interface AttributeEnumTypeFromGenerator {
    type: AttributeTypeKindFromGenerator.Enum;
    values: string[];
}

export type AttributeTypeFromGenerator =
    | {
          type: Exclude<AttributeTypeKindFromGenerator, AttributeTypeKindFromGenerator.Enum>;
      }
    | AttributeEnumTypeFromGenerator;

export interface SugarAttributeInfoFromGenerator {
    name: string;
    valueTypes: AttributeTypeFromGenerator[];
    markdownDescription?: string;
    shortMarkdownDescription?: string;
    defaultValue?: string;
    required?: boolean;
    deprecated?: boolean;
}

export interface SugarElementInfoFromGenerator {
    name: string;
    attributes?: SugarAttributeInfoFromGenerator[];
    availableChildren: SugarElementAvailableChildrenInfoFromGenerator;
    markdownDescription?: string;
    shortMarkdownDescription?: string;
    verified?: boolean;
}
