import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const okcm: SugarElementInfo = {
    name: "okcm",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: [...commonContentAttributes, { name: "name", valueTypes: [AttributeType.String] }],
};
