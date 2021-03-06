import { constant, Decoder, optional } from "@mojotech/json-type-validation";

import { DataPathUtils } from "../../DataSchema/DataPathUtils";
import { DataSchemaElementNode } from "../../DataSchema/DataSchemaNode";
import { DataSchemaUtils } from "../../DataSchema/DataSchemaUtils";
import { AttributeTypeKind, SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { SugarAttribute, SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
import { ISugarProjectContext } from "../Validator/ISugarProjectContext";

import { SugarValidatorRuleBase } from "./Bases/SugarValidatorRuleBase";
import { ValidationItem } from "./Bases/ValidationItem";

export class ValidPathRule extends SugarValidatorRuleBase {
    private readonly elementInfos: SugarElementInfo[];
    private readonly validations: ValidationItem[] = [];
    private readonly dataSchema: undefined | DataSchemaElementNode;
    public pathScopeStack: string[][] = [];

    public constructor(context: ISugarProjectContext) {
        super("valid-path");
        this.dataSchema = context.getDataSchema();
        this.elementInfos = context.getSugarElementInfos();
    }

    protected getDefaultSettings(): undefined {
        return;
    }

    protected createDecoder(): Decoder<undefined> {
        return optional(constant(undefined));
    }

    public enterElement(element: SugarElement): void {
        const pathScope = this.getPathScope(element);
        if (pathScope != undefined) {
            this.pathScopeStack.push(pathScope);
        }
    }

    public exitElement(element: SugarElement): void {
        const pathScope = this.getPathScope(element);
        if (pathScope != undefined) {
            this.pathScopeStack.pop();
        }
    }

    public visitAttribute(attribute: SugarAttribute): void {
        const attributeName = attribute.name;
        const element = attribute.parent;
        const elementInfo = this.elementInfos.find(x => x.name === element.name.value);
        if (this.dataSchema == undefined) {
            return;
        }
        if (attribute.value == undefined) {
            return;
        }
        if (elementInfo == undefined) {
            return;
        }
        const attributeInfo = (elementInfo.attributes || []).find(x => x.name === attributeName.value);
        if (attributeInfo == undefined) {
            return;
        }
        if (attributeInfo.valueTypes.length === 1 && attributeInfo.valueTypes[0].type === AttributeTypeKind.Path) {
            if (attributeInfo.name === "visibilityPath") {
                // TODO разобраться с правилом задания пути для такого атрибута
                return;
            }
            const rawPathValue = attribute.value.value;
            if (typeof rawPathValue !== "string") {
                return;
            }
            const pathValue = DataPathUtils.parseDataAttributeValue(rawPathValue);
            const fullPath = DataPathUtils.joinDataPaths(
                this.getCurrentPathScope(elementInfo.createPathScope ? 1 : 0),
                pathValue
            );
            const dataNode = DataSchemaUtils.findSchemaNodeByPath(this.dataSchema, fullPath);
            if (dataNode == undefined) {
                this.validations.push({
                    position: attribute.value.position,
                    message: `Элемент или атрибут '${fullPath.join("/")}' не найден в схеме данных`,
                });
            }
        }
    }

    public getValidations(): ValidationItem[] {
        return this.validations;
    }

    private getCurrentPathScope(skipFromTail: number): string[] {
        return this.pathScopeStack
            .slice(0, skipFromTail === 0 ? undefined : -skipFromTail)
            .reduce((x, y) => DataPathUtils.joinDataPaths(x, y), []);
    }

    private getPathScope(element: SugarElement): undefined | string[] {
        const elementInfo = this.elementInfos.find(x => x.name === element.name.value);
        if (elementInfo == undefined || !elementInfo.createPathScope) {
            return undefined;
        }
        const pathAttribute = (element.attributes || []).find(x => x.name.value === "path");
        if (
            pathAttribute == undefined ||
            pathAttribute.value == undefined ||
            typeof pathAttribute.value.value !== "string"
        ) {
            return undefined;
        }
        return DataPathUtils.parseDataAttributeValue(pathAttribute.value.value);
    }
}
