import { AvailableChildrenType, SugarElementInfo } from "../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const kokpo: SugarElementInfo = {
    name: "kokpo",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
