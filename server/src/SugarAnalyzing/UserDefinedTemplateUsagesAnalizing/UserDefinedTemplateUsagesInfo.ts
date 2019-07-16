import { UserDefinedSugarTemplateInfo } from "../../SugarElements/UserDefinedSugarTemplateInfo";
import { IUsagesGroup, IUsagesRequiredFields } from "../ReferencesBuilder";

export type UserDefinedTemplateUsagesInfo = Array<IUsagesGroup<UserDefinedSugarTemplateInfo, IUsagesRequiredFields>>;
