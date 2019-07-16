import { CodeLens, Location } from "vscode-languageserver-types";

import { CodeContext } from "../SugarAnalyzing/ContextResolving/CodeContext";
import { IUsagesGroup } from "../SugarAnalyzing/ReferencesBuilder";
import { UserDefinedTemplateUsagesBuilder } from "../SugarAnalyzing/UserDefinedTemplateUsagesAnalizing/UserDefinedTemplateUsagesBuilder";
import { UserDefinedTemplateUsagesInfo } from "../SugarAnalyzing/UserDefinedTemplateUsagesAnalizing/UserDefinedTemplateUsagesInfo";
import { UserDefinedTypeUsagesBuilder } from "../SugarAnalyzing/UserDefinedTypeUsagesAnalizing/UserDefinedTypeUsagesBuilder";
import { UserDefinedTypeUsagesInfoType } from "../SugarAnalyzing/UserDefinedTypeUsagesAnalizing/UserDefinedTypeUsagesInfo";
import { isNotNullOrUndefined } from "../Utils/TypingUtils";

import { SugarProjectIntellisenseService } from "./IntellisenseServices/SugarProjectIntellisenseService";

export class ReferencesService {
    private readonly sugarProject: SugarProjectIntellisenseService;
    private readonly documentUri: string;

    private readonly usagesGroups: {
        type?: IUsagesGroup[];
        template?: IUsagesGroup[];
    } = {};
    private typeBuilder: undefined | UserDefinedTypeUsagesBuilder;
    private templateBuilder: undefined | UserDefinedTemplateUsagesBuilder;

    public constructor(sugarProject: SugarProjectIntellisenseService, documentUri: string) {
        this.sugarProject = sugarProject;
        this.documentUri = documentUri;
    }

    public getAllUsagesGroups(): IUsagesGroup[] {
        return Object.values(this.usagesGroups)
            .filter(isNotNullOrUndefined)
            .reduce((x, y) => x.concat(y), []);
    }

    public buildAllUsages(): void {
        this.buildUserDefinedType();
        this.buildUserDefinedTemplate();
    }

    public findAllReferences(context: CodeContext): Location[] {
        return [...this.findTypeReferences(context), ...this.findTemplateReferences(context)];
    }

    public getAllCodeLenses(): CodeLens[] {
        return [...this.getTypeCodeLenses(), ...this.getTemplateCodeLenses()];
    }

    /* ================= пользовательские типы ================= */

    private buildUserDefinedType(): void {
        this.typeBuilder = new UserDefinedTypeUsagesBuilder(this.sugarProject.getSugarElementInfos());
        const currentUserDefinedTypes = this.sugarProject.getUserDefinedTypesBySugarFile(this.documentUri);
        if (currentUserDefinedTypes != undefined) {
            this.usagesGroups.type = this.typeBuilder.buildUsages(currentUserDefinedTypes, this.sugarProject);
        }
    }

    private findTypeReferences(context: CodeContext): Location[] {
        return (
            (this.typeBuilder &&
                this.typeBuilder.findReferences(context, this.usagesGroups.type as UserDefinedTypeUsagesInfoType)) ||
            []
        );
    }

    private getTypeCodeLenses(): CodeLens[] {
        return (
            (this.typeBuilder && this.usagesGroups.type && this.typeBuilder.getCodeLenses(this.usagesGroups.type)) || []
        );
    }

    /* ================= пользовательские шаблоны ================= */

    private buildUserDefinedTemplate(): void {
        this.templateBuilder = new UserDefinedTemplateUsagesBuilder(this.sugarProject.getSugarElementInfos());
        const currentUserDefinedTemplates = this.sugarProject.getUserDefinedTemplatesBySugarFile(this.documentUri);
        if (currentUserDefinedTemplates != undefined) {
            this.usagesGroups.template = this.templateBuilder.buildTemplateUsages(
                currentUserDefinedTemplates,
                this.sugarProject
            );
        }
    }
    private findTemplateReferences(context: CodeContext): Location[] {
        return (
            (this.templateBuilder &&
                this.templateBuilder.findReferences(context, this.usagesGroups
                    .template as UserDefinedTemplateUsagesInfo)) ||
            []
        );
    }

    private getTemplateCodeLenses(): CodeLens[] {
        return (
            (this.templateBuilder &&
                this.usagesGroups.template &&
                this.templateBuilder.getCodeLenses(this.usagesGroups.template)) ||
            []
        );
    }
}
