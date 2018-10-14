import { AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const okogu: SugarElementInfo = {
    name: "okogu",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
