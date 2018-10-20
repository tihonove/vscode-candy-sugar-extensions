import { SugarElementGroupInfo } from "../SugarElements/SugarElementGroupInfo";

export class HelpUrlBuilder {
    private readonly sugarElementGroups: SugarElementGroupInfo[];

    public constructor(sugarElementGroups: SugarElementGroupInfo[]) {
        this.sugarElementGroups = sugarElementGroups;
    }

    public getHelpUrlForAttribute(elementName: string, attributeName: string): string | undefined {
        const group = this.sugarElementGroups.find(x => x.elements.some(e => e.name === elementName));
        if (group == undefined) {
            return undefined;
        }
        const elementInfo = group.elements.find(x => x.name === elementName);
        if (elementInfo == undefined) {
            return undefined;
        }
        const attributeInfo = (elementInfo.attributes || []).find(x => x.name === attributeName);
        if (attributeInfo == undefined) {
            return undefined;
        }
        return `https://kontur-candy.github.io/#/${group.name}/${elementInfo.name}?id=${attributeInfo.name}`;
    }

    public getHelpUrlForElement(elementName: string): string | undefined {
        const group = this.sugarElementGroups.find(x => x.elements.some(e => e.name === elementName));
        if (group == undefined) {
            return undefined;
        }
        const elementInfo = group.elements.find(x => x.name === elementName);
        if (elementInfo == undefined) {
            return undefined;
        }
        return `https://kontur-candy.github.io/#/${group.name}/${elementInfo.name}`;
    }
}
