import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const sekdel: SugarElementInfo = {
    name: "sekdel",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
