import path from "path";

import { UriUtils } from "../../Utils/UriUtils";
import { ILogger } from "../Logging/Logger";

import { SugarProjectIntellisenseService } from "./SugarProjectIntellisenseService";

export class SugarProjectIntellisenseServiceCollection {
    private readonly logger: ILogger;
    private readonly projects: { [absolutePathToProject: string]: undefined | SugarProjectIntellisenseService } = {};

    public constructor(logger: ILogger) {
        this.logger = logger;
    }

    public getOrCreateServiceBySchemaFileUri(schemaFileUri: string): SugarProjectIntellisenseService {
        const absolutePathToProject = this.getAbsolutePathToSugarProjectBySchemaFile(schemaFileUri);
        return this.getOrCreateService(absolutePathToProject);
    }

    public getOrCreateServiceBySugarFileUri(sugarFileUri: string): SugarProjectIntellisenseService {
        const absolutePathToProject = this.getAbsolutePathToSugarProjectBySugarFile(sugarFileUri);
        return this.getOrCreateService(absolutePathToProject);
    }

    private getOrCreateService(absolutePathToProject: string): SugarProjectIntellisenseService {
        let result = this.projects[absolutePathToProject];
        if (result == undefined) {
            result = new SugarProjectIntellisenseService(this.logger, absolutePathToProject);
            this.projects[absolutePathToProject] = result;
            return result;
        }
        return result;
    }

    private getAbsolutePathToSugarProjectBySugarFile(sugarFileUri: string): string {
        const filename = UriUtils.toFileName(sugarFileUri);
        const absolutePathToProject = path.dirname(path.dirname(filename));
        const result = path.resolve(absolutePathToProject);
        return result;
    }

    private getAbsolutePathToSugarProjectBySchemaFile(schemaFileUri: string): string {
        const filename = UriUtils.toFileName(schemaFileUri);
        const absolutePathToProject = path.dirname(path.dirname(filename));
        const result = path.resolve(absolutePathToProject);
        return result;
    }
}
