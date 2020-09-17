import {
    AttributeType,
    AttributeTypes,
    AvailableChildrenType,
    SugarAttributeInfo,
    SugarElementDefinedType,
    SugarElementInfo,
} from "../../SugarElements/SugarElementInfo";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
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
                    valueTypes: [this.templateAttributeTypeToType(element)],
                    required: this.getAttributeValue(element, "required") === "true",
                });
            }
        }
    }

    private templateAttributeTypeToType(element: SugarElement): AttributeType {
        const attributeTypeName = this.getAttributeValue(element, "type");
        const attributeName = this.getAttributeValue(element, "name");
        if (attributeName === "path") {
            return AttributeTypes.Path;
        }
        if (attributeTypeName === "string") {
            return AttributeTypes.String;
        } else {
            return AttributeTypes.String;
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
        const value = element?.attributes?.find(a => a.name.value === attributeName)?.value?.value;
        if (typeof value === "string") {
            return value;
        } else {
            return undefined;
        }
    }
}
