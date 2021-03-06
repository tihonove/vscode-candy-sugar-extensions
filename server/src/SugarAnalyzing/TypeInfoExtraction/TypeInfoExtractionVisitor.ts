import { UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { SugarComment, SugarElement, SugarText } from "../../SugarParsing/SugarGrammar/SugarParser";
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

    private constraintElementToString(child: SugarElement | SugarText | SugarComment): undefined | string {
        if (child.type === "Text" || child.type === "Comment") {
            return undefined;
        }
        const attrs = (child.attributes || []).map(x => `${x.name.value}="${x.value ? x.value.value : ""}"`).join(" ");
        if (attrs === "") {
            return `<${child.name.value} />`;
        }
        return `<${child.name.value} ${attrs} />`;
    }

    private getAttributeValue(element: SugarElement, attributeName: string): undefined | string {
        const value = element?.attributes?.find(a => a.name.value === attributeName)?.value?.value ?? undefined;
        if (typeof value === "string") {
            return value;
        } else {
            return undefined;
        }
    }
}
