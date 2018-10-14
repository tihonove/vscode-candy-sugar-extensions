import { AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const stroyka: SugarElementInfo = {
    name: "stroyka",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
