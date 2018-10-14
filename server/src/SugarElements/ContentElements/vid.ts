import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const vid: SugarElementInfo = {
    name: "vid",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
