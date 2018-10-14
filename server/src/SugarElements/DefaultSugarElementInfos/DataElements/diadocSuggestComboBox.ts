import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const diadocSuggestComboBox: SugarElementInfo = {
    name: "diadocSuggestComboBox",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        { name: "path", valueTypes: [AttributeType.String] },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "type", valueTypes: [AttributeType.Type] },
        { name: "query", valueTypes: [AttributeType.FunctionName] },
    ],
};
