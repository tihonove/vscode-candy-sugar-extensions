import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";
import { pathAttribute } from "../Commons/pathAttribute";
import { typeAttribute } from "../Commons/typeAttribute";
import { visibilityPathAttribute, visibilityPathValueAttribute } from "../Commons/visibilityPathAttribute";

export const textarea: SugarElementInfo = {
    name: "textarea",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        typeAttribute,
        pathAttribute,
        visibilityPathAttribute,
        visibilityPathValueAttribute,
        { name: "autoResize", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "resize", valueTypes: [AttributeType.Enum], optional: true },
        { name: "width", valueTypes: [AttributeType.Number], optional: true },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "placeholder", valueTypes: [AttributeType.String], optional: true },
        { name: "defaultValue", valueTypes: [AttributeType.String], optional: true },
    ],
};
