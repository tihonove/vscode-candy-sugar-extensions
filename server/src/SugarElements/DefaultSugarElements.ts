import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../Suggester/SugarElementInfo";

const input: SugarElementInfo = {
    name: "input",
    attributes: [
        {
            name: "align",
            valueTypes: [AttributeType.String],
            markdownDescription: `**Выравнивание текста внутри поля ввода**
            
Значения: \`left\` или \`right\`

Значение по умолчанию: \`left\``,
        },
        {
            name: "width",
            valueTypes: [AttributeType.Number],
        },
        {
            name: "formula",
            valueTypes: [AttributeType.String],
        },
        {
            name: "path",
            valueTypes: [AttributeType.Path],
        },
    ],
    availableChildren: { type: AvailableChildrenType.NoChildren },
    markdownDescription: `**input**

Текстовое поле ввода`,
};

const page: SugarElementInfo = {
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
            name: "template",
            valueTypes: [AttributeType.String],
        },
        {
            name: "path",
            valueTypes: [AttributeType.Path],
        },
    ],
    availableChildren: { type: AvailableChildrenType.NoChildren },
    createPathScope: true,
};

const form: SugarElementInfo = {
    name: "form",
    attributes: [
        {
            name: "maxunitscount",
            valueTypes: [AttributeType.Number],
        },
        {
            name: "templates",
            valueTypes: [AttributeType.Boolean],
        },
        {
            name: "navigationLimit",
            valueTypes: [AttributeType.Number],
        },
    ],
    availableChildren: { type: AvailableChildrenType.Any },
};

const checkbox: SugarElementInfo = {
    name: "checkbox",
    attributes: [
        {
            name: "type",
            valueTypes: [AttributeType.String],
        },
        {
            name: "defaultValue",
            valueTypes: [AttributeType.String],
        },
        {
            name: "checkedValue",
            valueTypes: [AttributeType.String],
        },
        {
            name: "uncheckedValue",
            valueTypes: [AttributeType.String],
        },
        {
            name: "optional",
            valueTypes: [AttributeType.Boolean],
        },
        {
            name: "path",
            valueTypes: [AttributeType.Path],
        },
    ],
    availableChildren: { type: AvailableChildrenType.Any },
};

const block: SugarElementInfo = {
    name: "block",
    attributes: [
        {
            name: "visibilityPath",
            valueTypes: [AttributeType.Path],
        },
    ],
    availableChildren: { type: AvailableChildrenType.Any },
};

const bold: SugarElementInfo = {
    name: "bold",
    availableChildren: { type: AvailableChildrenType.Any },
};

const br: SugarElementInfo = {
    name: "br",
    availableChildren: { type: AvailableChildrenType.NoChildren },
};

const caption: SugarElementInfo = {
    name: "caption",
    availableChildren: { type: AvailableChildrenType.Any },
};

const choice: SugarElementInfo = {
    name: "choice",
    availableChildren: { type: AvailableChildrenType.Any },
};

export const allElements: SugarElementInfo[] = [input, page, form, checkbox, block, bold, br, caption, choice];
