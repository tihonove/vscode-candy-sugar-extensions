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

export enum AttributeTypeFromGenerator {
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
    createPathScope?: boolean;
    attributes?: SugarAttributeInfoFromGenerator[];
    availableChildren: SugarElementAvailableChildrenInfoFromGenerator;
    markdownDescription?: string;
    verified?: boolean;
}
