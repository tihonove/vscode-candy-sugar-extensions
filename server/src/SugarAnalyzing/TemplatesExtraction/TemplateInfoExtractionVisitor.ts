import { UserDefinedSugarTemplateInfo } from "../../SugarElements/UserDefinedSugarTemplateInfo";
import { SugarComment, SugarElement, SugarText } from "../../SugarParsing/SugarGrammar/SugarParser";
import { oc } from "../../Utils/ChainWrapper";
import { isNotNullOrUndefined } from "../../Utils/TypingUtils";
import { EmptySugarDomVisitor } from "../Traversing/EmptySugarDomVisitor";

export class TemplateInfoExtractionVisitor extends EmptySugarDomVisitor {
    private readonly sourceTemplatesElementInfos: UserDefinedSugarTemplateInfo[] = [];
    private isInsideTemplatesElement = false;
    private readonly absolutePath?: string;

    public constructor(absolutePath?: string) {
        super();
        this.absolutePath = absolutePath;
    }

    public getSourceTemplatesElementInfos(): UserDefinedSugarTemplateInfo[] {
        return this.sourceTemplatesElementInfos;
    }

    public enterElement(element: SugarElement): void {
        if (element.name.value === "templates") {
            this.isInsideTemplatesElement = true;
        }
    }

    public exitElement(element: SugarElement): void {
        if (element.name.value === "templates") {
            this.isInsideTemplatesElement = false;
        }
    }

    public visitElement(element: SugarElement): void {
        if (this.isInsideTemplatesElement && element.name.value === "template") {
            const userDefinedTemplates = this.getSugarElementInfoByParams(element);
            if (userDefinedTemplates) {
                this.sourceTemplatesElementInfos.push(userDefinedTemplates);
            }
        }
    }

    private getSugarElementInfoByParams(element: SugarElement): undefined | UserDefinedSugarTemplateInfo {
        const templateName = this.getAttributeValue(element, "name");
        if (templateName == undefined) {
            return undefined;
        }
        return {
            name: templateName,
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
        const value = oc(element.attributes)
            .with(x => x.find(a => a.name.value === attributeName))
            .with(x => x.value)
            .with(x => x.value)
            .return(x => x, undefined);
        if (typeof value === "string") {
            return value;
        } else {
            return undefined;
        }
    }
}
