import { UsedDefinedSugarTypeInfo } from "../../SugarElements/UsedDefinedSugarTypeInfo";
import { SugarElement, SugarText } from "../../SugarParsing/SugarGrammar/SugarParser";
import { oc } from "../../Utils/ChainWrapper";
import { isNotNullOrUndefined } from "../../Utils/TypingUtils";
import { EmptySugarDomVisitor } from "../Traversing/EmptySugarDomVisitor";

export class TypeInfoExtractionVisitor extends EmptySugarDomVisitor {
    private readonly typeInfos: UsedDefinedSugarTypeInfo[] = [];
    private isInsideTypesElement = false;

    public getTypeInfos(): UsedDefinedSugarTypeInfo[] {
        return this.typeInfos;
    }

    public enterElement(element: SugarElement): void {
        if (element.name.value === "types") {
            this.isInsideTypesElement = true;
        }
    }

    public exitElement(element: SugarElement): void {
        if (element.name.value === "types") {
            this.isInsideTypesElement = false;
        }
    }

    public visitElement(element: SugarElement): void {
        if (this.isInsideTypesElement) {
            if (element.name.value === "type") {
                const sugarTypeInfo = this.extractTypeInfoFromElement(element);
                if (sugarTypeInfo != undefined) {
                    this.typeInfos.push(sugarTypeInfo);
                }
            }
        }
    }

    private extractTypeInfoFromElement(element: SugarElement): undefined | UsedDefinedSugarTypeInfo {
        const typeName = this.getAttributeValue(element, "name");
        if (typeName == undefined) {
            return undefined;
        }
        return {
            name: typeName,
            baseName: this.getAttributeValue(element, "base"),
            description: this.getAttributeValue(element, "description"),
            requiredDescription: this.getAttributeValue(element, "requiredDescription"),
            constraintStrings: (element.children || [])
                .map(child => this.constraintElementToString(child))
                .filter(isNotNullOrUndefined),
            position: element.position,
        };
    }

    private constraintElementToString(child: SugarElement | SugarText): undefined | string {
        if (child.type === "Text") {
            return undefined;
        }
        const attrs = (child.attributes || []).map(x => `${x.name.value}="${x.value ? x.value.value : ""}"`).join(" ");
        if (attrs === "") {
            return `<${child.name.value} />`;
        }
        return `<${child.name.value} ${attrs} />`;
    }

    private getAttributeValue(element: SugarElement, attributeName: string): undefined | string {
        return oc(element.attributes)
            .with(x => x.find(a => a.name.value === attributeName))
            .with(x => x.value)
            .with(x => x.value)
            .return(x => x, undefined);
    }
}