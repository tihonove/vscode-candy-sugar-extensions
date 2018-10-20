import path from "path";

import { SugarElementGroupInfo } from "../../SugarElementGroupInfo";

import { customValidation } from "./customValidation";
import { digestCheck } from "./digestCheck";
import { enumeration } from "./enumeration";
import { fractionDigits } from "./fractionDigits";
import { integerDigits } from "./integerDigits";
import { length } from "./length";
import { maxInclusive } from "./maxInclusive";
import { maxLength } from "./maxLength";
import { minInclusive } from "./minInclusive";
import { minLength } from "./minLength";
import { pattern } from "./pattern";
import { totalDigits } from "./totalDigits";
import { typeElement } from "./type";
import { types } from "./types";

export const typeDefinitionElementsGroup: SugarElementGroupInfo = {
    name: "TypeDefinitionElements",
    caption: "Определение типов",
    descriptionPath: path.join(__dirname, "README.md"),
    elements: [
        customValidation,
        digestCheck,
        enumeration,
        fractionDigits,
        integerDigits,
        length,
        maxInclusive,
        maxLength,
        minInclusive,
        minLength,
        pattern,
        totalDigits,
        typeElement,
        types,
    ],
};
