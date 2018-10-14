import { AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const build: SugarElementInfo = {
    name: "build",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
