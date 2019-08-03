import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const prd: SugarElementInfo = {
    name: "prd",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [
        ...commonContentAttributes,
        { name: "defaultValue", valueTypes: [AttributeType.String], optional: true },
    ],
};