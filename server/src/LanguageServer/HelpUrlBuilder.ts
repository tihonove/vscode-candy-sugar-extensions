import { SugarElementInfo } from "../SugarElements/SugarElementInfo";

export class HelpUrlBuilder {
    private readonly sugarElementInfos: SugarElementInfo[];

    public constructor(sugarElementInfos: SugarElementInfo[]) {
        this.sugarElementInfos = sugarElementInfos;
    }

    public getHelpUrlForAttribute(elementName: string, _attributeName: string): string | undefined {
        return this.getHelpUrlForElement(elementName);
    }

    public getHelpUrlForElement(elementName: string): string | undefined {
        const elementInfo = this.sugarElementInfos.find(x => x.name === elementName);
        if (elementInfo == undefined) {
            return undefined;
        }
        return `https://git.skbkontur.ru/ke/keforms-engine/blob/master/DOCUMENTATION.md#${elementInfo.name}`;
    }
}
