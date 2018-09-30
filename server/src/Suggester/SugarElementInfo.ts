export enum AttributeType {
    Path,
    Type,
    String,
    Number,
    Boolean,
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
