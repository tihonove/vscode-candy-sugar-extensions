import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

export const form: SugarElementInfo = {
    name: "form",
    attributes: [
        { name: "requisite", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "maxunitscount", valueTypes: [AttributeType.Number] },
        { name: "hasRegionalForms", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "width", valueTypes: [AttributeType.Number], optional: true },
        { name: "modalIE8", valueTypes: [AttributeType.Number], deprecated: true },
        { name: "templates", valueTypes: [AttributeType.Boolean] },
        { name: "navigationLimit", valueTypes: [AttributeType.Number] },
        { name: "xmlns:uf", valueTypes: [AttributeType.String], optional: true },
        { name: "simple", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "hideUnitsAdder", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "forceNavigate", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "xmlns:m", valueTypes: [AttributeType.String] },
    ],
    availableChildren: { type: AvailableChildrenType.Any },
};
