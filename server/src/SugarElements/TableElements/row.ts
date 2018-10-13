import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

export const row: SugarElementInfo = {
    name: "row",
    availableChildren: {
        type: AvailableChildrenType.List,
        list: ["column"],
    },
    attributes: [
        {
            name: "kind",
            valueTypes: [AttributeType.String],
            optional: true,
        },
        {
            name: "subkind",
            valueTypes: [AttributeType.String],
            optional: true,
        },
        {
            name: "borderBottom",
            valueTypes: [AttributeType.Boolean],
            optional: true,
        },
    ],
};
