import { generateDifferences, showInvisibles } from "prettier-linter-helpers";

import { SugarFormatter } from "../../SugarFormatter/SugarFormatter";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
import { isNotNullOrUndefined } from "../../Utils/TypingUtils";
import { ISugarProjectContext } from "../Validator/ISugarProjectContext";

import { SugarValidatorRuleBase } from "./Bases/SugarValidatorRuleBase";
import { ValidationItem } from "./Bases/ValidationItem";
import { LineColumnOffsetConverter } from "./Internals/LineColumnOffsetConverter";

export class ValidCodeStyleRule extends SugarValidatorRuleBase {
    private validations: ValidationItem[] = [];

    public constructor(_context: ISugarProjectContext) {
        super("code-style");
    }

    public beforeProcess(_sugarDocument: SugarElement, input: string): void {
        const lineOffsetConverter = new LineColumnOffsetConverter(input, { origin: 1 });
        const formatter = new SugarFormatter({ maxLength: 120, tabs: 4 });
        const formattedInput = formatter.format(input);
        if (formattedInput !== input) {
            const differences = generateDifferences(input, formattedInput);
            this.validations = differences
                .map<ValidationItem | undefined>(difference => {
                    switch (difference.operation) {
                        case "insert":
                            return {
                                message: `Insert '${showInvisibles(difference.insertText)}'`,
                                position: {
                                    start: {
                                        offset: difference.offset,
                                        ...lineOffsetConverter.fromOffset(difference.offset),
                                    },
                                    end: {
                                        offset: difference.offset,
                                        ...lineOffsetConverter.fromOffset(difference.offset),
                                    },
                                },
                            };
                            break;
                        case "delete":
                            return {
                                message: `Insert '${showInvisibles(difference.deleteText)}'`,
                                position: {
                                    start: {
                                        offset: difference.offset,
                                        ...lineOffsetConverter.fromOffset(difference.offset),
                                    },
                                    end: {
                                        offset: difference.offset + difference.deleteText.length,
                                        ...lineOffsetConverter.fromOffset(
                                            difference.offset + difference.deleteText.length
                                        ),
                                    },
                                },
                            };
                            break;
                        case "replace":
                            return {
                                message: `Replace '${showInvisibles(difference.deleteText)}' with '${showInvisibles(
                                    difference.insertText
                                )}'`,
                                position: {
                                    start: {
                                        offset: difference.offset,
                                        ...lineOffsetConverter.fromOffset(difference.offset),
                                    },
                                    end: {
                                        offset: difference.offset + difference.deleteText.length,
                                        ...lineOffsetConverter.fromOffset(
                                            difference.offset + difference.deleteText.length
                                        ),
                                    },
                                },
                            };
                            break;
                        default:
                            return undefined;
                    }
                })
                .filter(isNotNullOrUndefined);
        }
    }

    public getValidations(): ValidationItem[] {
        return this.validations;
    }
}
