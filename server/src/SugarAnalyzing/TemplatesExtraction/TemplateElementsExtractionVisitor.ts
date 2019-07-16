import {
    AttributeType,
    AvailableChildrenType,
    SugarAttributeInfo,
    SugarElementDefinedType,
    SugarElementInfo,
} from "../../SugarElements/SugarElementInfo";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
import { oc } from "../../Utils/ChainWrapper";
import { EmptySugarDomVisitor } from "../Traversing/EmptySugarDomVisitor";

export class TemplateElementsExtractionVisitor extends EmptySugarDomVisitor {
    private readonly templatesElementInfos: SugarElementInfo[] = [];
    private isInsideTemplatesElement = false;
    private attributes: SugarAttributeInfo[] = [];

    public getTemplatesElementInfos(): SugarElementInfo[] {
        return this.templatesElementInfos;
    }

    public enterElement(element: SugarElement): void {
        if (element.name.value === "templates") {
            this.isInsideTemplatesElement = true;
        }
    }

    public exitElement(element: SugarElement): void {
        if (element.name.value === "templates") {
            this.isInsideTemplatesElement = false;
            return;
        }
        if (element.name.value === "template") {
            const sugarElementInfo = this.getSugarElementInfoByParams(element);
            if (sugarElementInfo) {
                this.templatesElementInfos.push(sugarElementInfo);
            }
            this.attributes = [];
        }
    }

    public visitElement(element: SugarElement): void {
        if (this.isInsideTemplatesElement && element.name.value === "param") {
            const name = this.getAttributeValue(element, "name");
            if (name) {
                this.attributes.push({
                    name: name,
                    valueTypes: [this.getAttributeValue(element, "type") as AttributeType],
                    optional: this.getAttributeValue(element, "required") !== "true",
                });
            }
        }
    }

    private getSugarElementInfoByParams(element: SugarElement): undefined | SugarElementInfo {
        const templateName = this.getAttributeValue(element, "name");
        if (templateName == undefined) {
            return undefined;
        }
        return {
            name: templateName,
            attributes: this.attributes,
            availableChildren: { type: AvailableChildrenType.NoChildren },
            definedType: SugarElementDefinedType.Template,
        };
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
