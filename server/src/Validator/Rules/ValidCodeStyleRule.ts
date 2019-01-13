import { constant, Decoder, number, object, oneOf, optional } from "@mojotech/json-type-validation";
import { generateDifferences, showInvisibles } from "prettier-linter-helpers";

import { EndOfLineType, SugarFormatter, SugarFormatterOptions } from "../../SugarFormatter/SugarFormatter";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
import { isNotNullOrUndefined } from "../../Utils/TypingUtils";
import { ValidatorSettings } from "../Settings/ValidatorSettings";
import { ISugarProjectContext } from "../Validator/ISugarProjectContext";

import { SugarValidatorRuleBase } from "./Bases/SugarValidatorRuleBase";
import { ValidationItem } from "./Bases/ValidationItem";
import { LineColumnOffsetConverter } from "./Internals/LineColumnOffsetConverter";

export interface ValidCodeStyleRuleOptions {
    tabWidth?: number;
    printWidth?: number;
    endOfLine?: EndOfLineType;
}

export class ValidCodeStyleRule extends SugarValidatorRuleBase<ValidCodeStyleRuleOptions> {
    private validations: ValidationItem[] = [];

    public constructor(_context: ISugarProjectContext) {
        super("code-style");
    }

    public static getSugarFormatterOptionsFromValidatorSettings(
        validatorSettings: ValidatorSettings
    ): SugarFormatterOptions {
        const decoder = optional(
            object<ValidCodeStyleRuleOptions>({
                tabWidth: optional(number()),
                printWidth: optional(number()),
                endOfLine: optional(
                    oneOf(
                        constant<EndOfLineType>("auto"),
                        constant<EndOfLineType>("lf"),
                        constant<EndOfLineType>("crlf"),
                        constant<EndOfLineType>("cr")
                    )
                ),
            })
        );
        const settings =
            validatorSettings["code-style"] == undefined
                ? {}
                : decoder.runWithException(validatorSettings["code-style"][1]) || {};
        return { ...this.getDefaultSugarFormatterOptions(), ...settings };
    }

    private static getDefaultSugarFormatterOptions(): SugarFormatterOptions {
        return {
            tabWidth: 4,
            printWidth: 120,
            endOfLine: "auto",
        };
    }

    protected getDefaultSettings(): ValidCodeStyleRuleOptions {
        return ValidCodeStyleRule.getDefaultSugarFormatterOptions();
    }

    protected createDecoder(): Decoder<undefined | ValidCodeStyleRuleOptions> {
        return optional(
            object<ValidCodeStyleRuleOptions>({
                tabWidth: optional(number()),
                printWidth: optional(number()),
                endOfLine: optional(
                    oneOf(
                        constant<EndOfLineType>("auto"),
                        constant<EndOfLineType>("lf"),
                        constant<EndOfLineType>("crlf"),
                        constant<EndOfLineType>("cr")
                    )
                ),
            })
        );
    }

    public beforeProcess(_sugarDocument: SugarElement, input: string): void {
        const lineOffsetConverter = new LineColumnOffsetConverter(input, { origin: 1 });
        const formatter = new SugarFormatter({
            ...ValidCodeStyleRule.getDefaultSugarFormatterOptions(),
            ...this.settings,
        });
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
