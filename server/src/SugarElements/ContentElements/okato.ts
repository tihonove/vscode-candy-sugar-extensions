import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const okato: SugarElementInfo = {
    name: "okato",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
