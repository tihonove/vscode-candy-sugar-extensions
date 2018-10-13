import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

export const page: SugarElementInfo = {
    name: "page",
    attributes: [
        {
            name: "id",
            valueTypes: [AttributeType.String],
        },
        {
            name: "navigationName",
            valueTypes: [AttributeType.String],
        },
        {
            name: "title",
            valueTypes: [AttributeType.String],
            optional: true,
        },
        {
            name: "labelFetchfn",
            valueTypes: [AttributeType.FunctionName],
            optional: true,
        },
        {
            name: "template",
            valueTypes: [AttributeType.String],
        },
        {
            name: "path",
            valueTypes: [AttributeType.Path],
        },
        {
            name: "maxunitscount",
            valueTypes: [AttributeType.Number],
        },
        {
            name: "navigationLimit",
            valueTypes: [AttributeType.Number],
        },
        {
            name: "modalIE8",
            valueTypes: [AttributeType.Boolean],
        },
        {
            name: "templates",
            valueTypes: [AttributeType.Boolean],
        },
    ],
    availableChildren: { type: AvailableChildrenType.NoChildren },
    createPathScope: true,
};
