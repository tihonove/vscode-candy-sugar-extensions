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

export const then: SugarElementInfo = { name: "then", availableChildren: { type: AvailableChildrenType.Any } };

export const elseElement: SugarElementInfo = { name: "else", availableChildren: { type: AvailableChildrenType.Any } };
