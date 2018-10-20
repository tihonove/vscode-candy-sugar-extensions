import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const ifElement: SugarElementInfo = {
    name: "if",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        {
            name: "isIndividual",
            valueTypes: [AttributeType.Boolean],
        },
    ],
};

