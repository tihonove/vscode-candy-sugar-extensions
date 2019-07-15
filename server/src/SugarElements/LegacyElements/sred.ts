import { AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const sred: SugarElementInfo = {
    name: "sred",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
