import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";
import { pathAttribute } from "../Commons/pathAttribute";
import { visibilityPathAttribute } from "../Commons/visibilityPathAttribute";

export const checkbox: SugarElementInfo = {
    name: "checkbox",
    attributes: [
        visibilityPathAttribute,
        { name: "type", valueTypes: [AttributeType.Type] },
        { name: "defaultValue", valueTypes: [AttributeType.String] },
        { name: "checkedValue", valueTypes: [AttributeType.String] },
        { name: "uncheckedValue", valueTypes: [AttributeType.String] },
        { name: "otherValue", valueTypes: [AttributeType.String], optional: true },
        { name: "optional", valueTypes: [AttributeType.Boolean] },
        pathAttribute,
    ],
    availableChildren: { type: AvailableChildrenType.Any },
};
