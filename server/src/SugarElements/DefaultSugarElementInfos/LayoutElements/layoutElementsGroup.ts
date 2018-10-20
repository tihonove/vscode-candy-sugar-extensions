import path from "path";

import { SugarElementGroupInfo } from "../../SugarElementGroupInfo";

import { block } from "./block";
import { bold } from "./bold";
import { br } from "./br";
import { caption } from "./caption";
import { entity } from "./entity";
import { gray } from "./gray";
import { header } from "./header";
import { help } from "./help";
import { hr } from "./hr";
import { icon } from "./icon";
import { italic } from "./italic";
import { linetext } from "./linetext";
import { strong } from "./strong";
import { sub } from "./sub";
import { subheader } from "./subheader";
import { sup } from "./sup";
import { warning } from "./warning";

export const layoutElementsGroup: SugarElementGroupInfo = {
    name: "LayoutElements",
    caption: "Раскладка и форматирвоание",
    descriptionPath: path.join(__dirname, "README.md"),
    elements: [
        block,
        bold,
        br,
        caption,
        entity,
        gray,
        header,
        help,
        hr,
        icon,
        italic,
        linetext,
        strong,
        sub,
        subheader,
        sup,
        warning,
    ],
};
