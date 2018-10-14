import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const customValidation: SugarElementInfo = {
    name: "customValidation",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        { name: "value", valueTypes: [AttributeType.FunctionName] },
        { name: "force", valueTypes: [AttributeType.Boolean], optional: true },
    ],
};
