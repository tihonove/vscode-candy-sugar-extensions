import path from "path";

import { SugarElementGroupInfo } from "../../SugarElementGroupInfo";

import { column } from "./column";
import { multiline } from "./multiline";
import { row } from "./row";
import { table } from "./table";

export const tableElementsGroup: SugarElementGroupInfo = {
    name: "TableElements",
    caption: "Таблицы",
    descriptionPath: path.join(__dirname, "README.md"),
    elements: [column, multiline, row, table],
};
