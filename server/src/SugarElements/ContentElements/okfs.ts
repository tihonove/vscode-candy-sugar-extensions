import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const okfs: SugarElementInfo = {
    name: "okfs",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
