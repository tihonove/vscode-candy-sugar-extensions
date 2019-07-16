import { UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { SugarAttributeValue } from "../../SugarParsing/SugarGrammar/SugarParser";
import { CodePosition } from "../../Utils/PegJSUtils/Types";
import { IUsagesGroup, IUsagesRequiredFields } from "../ReferencesBuilder";

export type UserDefinedTypeUsagesInfoType = Array<IUsagesGroup<UserDefinedSugarTypeInfo, UserDefinedTypeUsage>>;

export interface UserDefinedTypeUsage extends IUsagesRequiredFields {
    attributeValueNode: SugarAttributeValue;
    typeUsagePosition: CodePosition;
}
