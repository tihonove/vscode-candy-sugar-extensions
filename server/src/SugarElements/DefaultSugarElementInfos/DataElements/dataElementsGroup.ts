import path from "path";

import { SugarElementGroupInfo } from "../../SugarElementGroupInfo";

import { attachments } from "./attachments";
import { checkbox } from "./checkbox";
import { combobox } from "./combobox";
import { date } from "./date";
import { diadocSuggestComboBox } from "./diadocSuggestComboBox";
import { digest } from "./digest";
import { fileloader } from "./fileloader";
import { fio } from "./fio";
import { highlight } from "./highlight";
import { inn } from "./inn";
import { input } from "./input";
import { kladr } from "./kladr";
import { link } from "./link";
import { page } from "./page";
import { picklist } from "./picklist";
import { radio } from "./radio";
import { radiogroup } from "./radiogroup";
import { select } from "./select";
import { text } from "./text";
import { textarea } from "./textarea";

export const dataElementsGroup: SugarElementGroupInfo = {
    name: "DataElements",
    caption: "Базовые конролы",
    descriptionPath: path.join(__dirname, "README.md"),
    elements: [
        input,
        attachments,
        checkbox,
        combobox,
        date,
        diadocSuggestComboBox,
        digest,
        fileloader,
        fio,
        highlight,
        inn,
        kladr,
        link,
        page,
        picklist,
        radio,
        radiogroup,
        select,
        text,
        textarea,
    ],
};
