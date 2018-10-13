import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../Suggester/SugarElementInfo";

import { fetchFnAttribute } from "../Commons/fetchFnAttribute";
import { pathAttribute } from "../Commons/pathAttribute";
import { visibilityPathAttribute } from "../Commons/visibilityPathAttribute";

export const input: SugarElementInfo = {
    name: "input",
    attributes: [
        pathAttribute,
        visibilityPathAttribute,
        {
            name: "align",
            valueTypes: [AttributeType.String],
            shortMarkdownDescription: "Выравнивание текста внутри поля ввода (`left` | `right`, default: `left`)",
            markdownDescription: `**Выравнивание текста внутри поля ввода**
            
Значения: \`left\` или \`right\`

Значение по умолчанию: \`left\``,
        },
        {
            name: "width",
            valueTypes: [AttributeType.Number],
        },
        {
            name: "auto",
            valueTypes: [AttributeType.Boolean],
        },
        {
            name: "disabled",
            valueTypes: [AttributeType.Boolean],
            optional: true,
        },
        {
            name: "textOverflow",
            valueTypes: [AttributeType.Boolean],
            optional: true,
        },
        {
            name: "editable",
            valueTypes: [AttributeType.Boolean],
        },
        {
            name: "defaultValue",
            valueTypes: [AttributeType.String],
        },
        {
            name: "title",
            valueTypes: [AttributeType.String],
            optional: true,
        },
        {
            name: "optional",
            valueTypes: [AttributeType.Boolean],
            optional: true,
        },
        {
            name: "formula",
            valueTypes: [AttributeType.String],
        },
        {
            name: "emptydescription",
            valueTypes: [AttributeType.String],
        },
        {
            name: "requisite",
            valueTypes: [AttributeType.Boolean],
        },
        {
            name: "settings",
            valueTypes: [AttributeType.Boolean],
        },
        {
            name: "type",
            valueTypes: [AttributeType.Type],
        },
        fetchFnAttribute,
    ],
    availableChildren: { type: AvailableChildrenType.NoChildren },
    markdownDescription: `Текстовое поле ввода. Используется только для редактирование текста.`,
};
