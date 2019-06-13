import { AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const okved: SugarElementInfo = {
    name: "okved",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
