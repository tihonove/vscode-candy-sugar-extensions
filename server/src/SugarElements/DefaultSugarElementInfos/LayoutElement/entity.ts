import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const entity: SugarElementInfo = {
    name: "entity",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        { name: "value", valueTypes: [AttributeType.Enum] },
        { name: "width", valueTypes: [AttributeType.Number], optional: true },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
    ],
};
