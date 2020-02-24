import { AttributeTypes, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const prd: SugarElementInfo = {
    name: "prd",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        ...commonContentAttributes,
        { name: "defaultValue", valueTypes: [AttributeTypes.String], required: false },
    ],
};
