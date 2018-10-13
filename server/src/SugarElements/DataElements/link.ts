import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { pathAttribute } from "../Commons/pathAttribute";

export const link: SugarElementInfo = {
    name: "link",
    availableChildren: {
        type: AvailableChildrenType.Any,
    },
    attributes: [
        {
            name: "href",
            valueTypes: [AttributeType.String],
            optional: true,
        },
        pathAttribute,
        {
            name: "onClick",
            valueTypes: [AttributeType.FunctionName],
            optional: true,
        },
    ],
};
