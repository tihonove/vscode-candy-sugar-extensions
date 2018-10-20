import { AttributeType, SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { SugarAttribute } from "../../SugarParsing/SugarGrammar/SugarParser";
import { EmptySugarDomVisitor } from "../Traversing/EmptySugarDomVisitor";

import { UserDefinedTypeUsagesInfo } from "./UserDefinedTypeUsagesInfo";

export class UserDefinedTypeUsagesVisitor extends EmptySugarDomVisitor {
    private readonly usages: UserDefinedTypeUsagesInfo[];
    private readonly sugarElementInfos: SugarElementInfo[];
    private readonly userDefinedTypes: UserDefinedSugarTypeInfo[];

    public constructor(userDefinedTypes: UserDefinedSugarTypeInfo[], sugarElementInfos: SugarElementInfo[]) {
        super();
        this.sugarElementInfos = sugarElementInfos;
        this.userDefinedTypes = userDefinedTypes;
        this.usages = this.userDefinedTypes.map<UserDefinedTypeUsagesInfo>(x => ({ type: x, usages: [] }));
    }

    public getUsages(): UserDefinedTypeUsagesInfo[] {
        return this.usages;
    }

    public visitAttribute(attribute: SugarAttribute): void {
        const elementName = attribute.parent.name.value;
        const attributeName = attribute.name.value;
        if (attribute.value == undefined) {
            return;
        }
        const attributeValue = attribute.value.value;
        const elementInfo = this.sugarElementInfos.find(x => x.name === elementName);
        if (elementInfo == undefined) {
            return;
        }
        const attributeInfo = (elementInfo.attributes || []).find(x => x.name === attributeName);
        if (attributeInfo == undefined) {
            return;
        }
        if (!attributeInfo.valueTypes.includes(AttributeType.Type)) {
            return;
        }
        const userDefinedType = this.userDefinedTypes.find(x => x.name === attributeValue);
        if (userDefinedType == undefined) {
            return;
        }
        let usageInfo = this.usages.find(x => x.type === userDefinedType);
        if (usageInfo == undefined) {
            usageInfo = { type: userDefinedType, usages: [] };
            this.usages.push(usageInfo);
        }
        usageInfo.usages.push({
            attributeValueNode: attribute.value,
            elementPosition: attribute.parent.position,
            typeUsagePosition: attribute.value.position,
        });
    }
}
