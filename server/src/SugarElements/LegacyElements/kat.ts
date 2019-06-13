import { AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const kat: SugarElementInfo = {
    name: "kat",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
