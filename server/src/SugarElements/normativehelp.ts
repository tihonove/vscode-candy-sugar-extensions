import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../Suggester/SugarElementInfo";

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
