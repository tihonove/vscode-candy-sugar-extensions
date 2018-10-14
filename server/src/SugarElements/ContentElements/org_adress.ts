import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const org_adress: SugarElementInfo = {
    name: "org_adress",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
