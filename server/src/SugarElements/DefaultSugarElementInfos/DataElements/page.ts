import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const page: SugarElementInfo = {
    name: "page",
    attributes: [
        { name: "id", valueTypes: [AttributeType.String] },
        { name: "navigationName", valueTypes: [AttributeType.String] },
        { name: "title", valueTypes: [AttributeType.String], optional: true },
        { name: "labelFetchfn", valueTypes: [AttributeType.FunctionName], optional: true },
        { name: "orientation", valueTypes: [AttributeType.Enum], optional: true },
        { name: "template", valueTypes: [AttributeType.String] },
        { name: "path", valueTypes: [AttributeType.Path] },
        { name: "maxunitscount", valueTypes: [AttributeType.Number] },
        { name: "navigationLimit", valueTypes: [AttributeType.Number] },
        { name: "modalIE8", valueTypes: [AttributeType.Boolean] },
        { name: "templates", valueTypes: [AttributeType.Boolean] },
        { name: "height", valueTypes: [AttributeType.Number], optional: true },
        { name: "formName", valueTypes: [AttributeType.String], optional: true },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
    ],
    availableChildren: { type: AvailableChildrenType.NoChildren },
    createPathScope: true,
};