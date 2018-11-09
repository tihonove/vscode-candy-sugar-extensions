import { UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { SugarElement, SugarText } from "../../SugarParsing/SugarGrammar/SugarParser";
import { oc } from "../../Utils/ChainWrapper";
import { isNotNullOrUndefined } from "../../Utils/TypingUtils";
import { EmptySugarDomVisitor } from "../Traversing/EmptySugarDomVisitor";

export class TypeInfoExtractionVisitor extends EmptySugarDomVisitor {
    private readonly typeInfos: UserDefinedSugarTypeInfo[] = [];
    private isInsideTypesElement = false;
    private readonly absolutePath?: string;

    public constructor(absolutePath?: string) {
        super();
        this.absolutePath = absolutePath;
    }

    public getTypeInfos(): UserDefinedSugarTypeInfo[] {
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

    private extractTypeInfoFromElement(element: SugarElement): undefined | UserDefinedSugarTypeInfo {
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
            absoluteSugarFilePath: this.absolutePath,
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
