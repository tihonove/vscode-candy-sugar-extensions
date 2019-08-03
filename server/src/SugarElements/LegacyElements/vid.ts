import { AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const vid: SugarElementInfo = {
    name: "vid",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
