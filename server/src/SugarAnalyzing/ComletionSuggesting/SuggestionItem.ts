import { TypeKind } from "../../SugarElements/UserDefinedSugarTypeInfo";

export enum SuggestionItemType {
    Element,
    Attribute,
    DataElement,
    DataAttribute,
    Type,
    EnumItem,
}

export type SuggestionItem =
    | {
          type: SuggestionItemType.Element;
          name: string;
      }
    | {
          type: SuggestionItemType.DataElement;
          name: string;
          fullPath: string[];
      }
    | {
          type: SuggestionItemType.DataAttribute;
          name: string;
          fullPath: string[];
      }
    | {
          type: SuggestionItemType.Attribute;
          name: string;
          parentElementName: string;
      }
    | {
          type: SuggestionItemType.Type;
          name: string;
          typeKind: TypeKind;
      }
    | {
          type: SuggestionItemType.EnumItem;
          name: string;
      };
