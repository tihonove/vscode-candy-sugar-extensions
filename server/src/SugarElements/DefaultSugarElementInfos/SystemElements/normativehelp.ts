import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const normativehelp: SugarElementInfo = {
    name: "normativehelp",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        {
            name: "id",
            valueTypes: [AttributeType.String],
        },
        {
            name: "commonId",
            valueTypes: [AttributeType.String],
        },
        {
            name: "knd",
            valueTypes: [AttributeType.String],
        },
    ],
};
