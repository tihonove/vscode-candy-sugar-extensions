import { Decoder } from "@mojotech/json-type-validation";

import { EmptySugarDomVisitor } from "../../../SugarAnalyzing/Traversing/EmptySugarDomVisitor";
import { SugarElement } from "../../../SugarParsing/SugarGrammar/SugarParser";

import { ISugarValidatorRule } from "./ISugarValidatorRule";
import { ValidationItem } from "./ValidationItem";

export abstract class SugarValidatorRuleBase<TSettings = undefined> extends EmptySugarDomVisitor
    implements ISugarValidatorRule {
    protected settings: TSettings;

    public readonly name: string;

    public constructor(name: string) {
        super();
        this.name = name;
        this.settings = this.getDefaultSettings();
    }

    protected abstract getDefaultSettings(): TSettings;

    protected abstract createDecoder(): Decoder<undefined | TSettings>;

    public setRuleSettings(options: unknown): void {
        const decoder = this.createDecoder();
        const settings = decoder.runWithException(options);
        this.settings = settings || this.getDefaultSettings();
    }

    public beforeProcess(_sugarDocument: SugarElement, _input: string): void {
        // empty impl
    }

    public getValidations(): ValidationItem[] {
        return [];
    }
}
