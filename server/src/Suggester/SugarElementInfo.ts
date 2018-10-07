export enum AttributeType {
    Path = "Path",
    Type = "Type",
    String = "String",
    Number = "Number",
    Boolean = "Boolean",
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
