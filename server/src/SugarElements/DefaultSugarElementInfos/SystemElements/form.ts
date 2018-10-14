import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

export const form: SugarElementInfo = {
    name: "form",
    attributes: [
        { name: "requisite", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "maxunitscount", valueTypes: [AttributeType.Number], optional: true },
        { name: "hasRegionalForms", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "width", valueTypes: [AttributeType.Number], optional: true },
        { name: "modalIE8", valueTypes: [AttributeType.Boolean], deprecated: true, optional: true },
        { name: "templates", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "navigationLimit", valueTypes: [AttributeType.Number], optional: true },
        { name: "xmlns:uf", valueTypes: [AttributeType.String], optional: true },
        { name: "simple", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "hideUnitsAdder", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "forceNavigate", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "xmlns:m", valueTypes: [AttributeType.String], optional: true },
    ],
    availableChildren: { type: AvailableChildrenType.Any },
};
