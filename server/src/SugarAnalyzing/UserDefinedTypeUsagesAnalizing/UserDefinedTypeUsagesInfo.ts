import { UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { SugarAttributeValue } from "../../SugarParsing/SugarGrammar/SugarParser";
import { CodePosition } from "../../Utils/PegJSUtils/Types";

export interface UserDefinedTypeUsagesInfo {
    type: UserDefinedSugarTypeInfo;
    usages: UserDefinedTypeUsage[];
}

interface UserDefinedTypeUsage {
    attributeValueNode: SugarAttributeValue;
    typeUsagePosition: CodePosition;
    elementPosition: CodePosition;
    absoluteSugarFilePath: string;
}
