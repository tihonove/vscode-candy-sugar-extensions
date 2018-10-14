import { AttributeType, AvailableChildrenType, SugarElementInfo } from "../../SugarElementInfo";

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
            optional: true,
            shortMarkdownDescription: "Выравнивание текста внутри поля ввода (`left` | `right`, default: `left`)",
            markdownDescription: `**Выравнивание текста внутри поля ввода**
            
Значения: \`left\` или \`right\`

Значение по умолчанию: \`left\``,
        },
        { name: "width", valueTypes: [AttributeType.Number], optional: true },
        { name: "auto", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "disabled", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "textOverflow", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "editable", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "defaultValue", valueTypes: [AttributeType.String], optional: true },
        { name: "title", valueTypes: [AttributeType.String], optional: true },
        { name: "optional", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "formula", valueTypes: [AttributeType.String], optional: true },
        { name: "emptydescription", valueTypes: [AttributeType.String], optional: true },
        { name: "requisite", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "settings", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "type", valueTypes: [AttributeType.Type], optional: true },
        { name: "placeholder", valueTypes: [AttributeType.String], optional: true },
        { name: "hint", valueTypes: [AttributeType.String], optional: true },
        { name: "rngAttribute", valueTypes: [AttributeType.Boolean], optional: true },
        { name: "gId", valueTypes: [AttributeType.PicklistId], optional: true },
        fetchFnAttribute,
    ],
    availableChildren: { type: AvailableChildrenType.NoChildren },
    markdownDescription: `Текстовое поле ввода. Используется только для редактирование текста.`,
};
