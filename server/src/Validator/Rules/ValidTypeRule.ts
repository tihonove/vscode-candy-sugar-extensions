import { EmptySugarDomVisitor } from "../../SugarAnalyzing/Traversing/EmptySugarDomVisitor";
import { AttributeType, SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { defaultBuiltInTypeNames, UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { SugarAttribute } from "../../SugarParsing/SugarGrammar/SugarParser";

import { ValidationItem } from "./Bases/ValidationItem";

export class ValidTypeRule extends EmptySugarDomVisitor {
    private readonly elementInfos: SugarElementInfo[];
    private readonly validations: ValidationItem[] = [];
    private readonly userDefinedTypes: UserDefinedSugarTypeInfo[];
    public readonly name: string;

    public constructor(userDefinedTypes: UserDefinedSugarTypeInfo[], elementInfos: SugarElementInfo[]) {
        super();
        this.userDefinedTypes = userDefinedTypes;
        this.elementInfos = elementInfos;
        this.name = "valid-type";
    }

    public visitAttribute(attribute: SugarAttribute): void {
        const attributeName = attribute.name;
        const element = attribute.parent;
        const elementInfo = this.elementInfos.find(x => x.name === element.name.value);
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
        if (attributeInfo.valueTypes.length === 1 && attributeInfo.valueTypes[0] === AttributeType.Type) {
            const typeName = attribute.value.value;
            if (!this.isTypeExists(typeName)) {
                this.validations.push({
                    position: attribute.value.position,
                    message: `Тип '${typeName}' не существует`,
                });
            }
        }
    }

    public getValidations(): ValidationItem[] {
        return this.validations;
    }

    private isTypeExists(typeName: string): boolean {
        return this.userDefinedTypes.some(x => x.name === typeName) || defaultBuiltInTypeNames.includes(typeName);
    }
}
