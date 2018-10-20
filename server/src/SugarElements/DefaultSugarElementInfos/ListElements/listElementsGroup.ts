import path from "path";

import { SugarElementGroupInfo } from "../../SugarElementGroupInfo";

import { item } from "./item";
import { list } from "./list";

export const listElementsGroup: SugarElementGroupInfo = {
    name: "ListElements",
    caption: "Списки",
    descriptionPath: path.join(__dirname, "README.md"),
    elements: [list, item],
};
