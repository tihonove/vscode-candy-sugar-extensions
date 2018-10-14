import { AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { commonContentAttributes } from "./commonContentAttributes";

export const sd: SugarElementInfo = {
    name: "sd",
    availableChildren: { type: AvailableChildrenType.Any },
    attributes: commonContentAttributes,
};
