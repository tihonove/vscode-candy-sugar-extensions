import { AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const inv: SugarElementInfo = {
    name: "inv",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
