import { AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const e_mail: SugarElementInfo = {
    name: "e_mail",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
