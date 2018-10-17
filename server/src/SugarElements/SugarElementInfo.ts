export enum AttributeType {
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
}

export enum AvailableChildrenType {
    NoChildren,
    Any,
    TextOny,
    List,
}

export interface SugarAttributeInfo {
    name: string;
    valueTypes: AttributeType[];
    markdownDescription?: string;
    shortMarkdownDescription?: string;
    defaultValue?: string;
    optional?: boolean;
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
          type: AvailableChildrenType.TextOny;
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
}
