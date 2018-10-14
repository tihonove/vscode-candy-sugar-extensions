import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const kat: SugarElementInfo = {
    name: "kat",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
