import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const oktmo: SugarElementInfo = {
    name: "oktmo",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
