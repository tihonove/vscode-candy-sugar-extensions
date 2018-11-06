import * as fs from "fs";
import path from "path";

import { DataSchemaElementNode } from "../DataSchema/DataSchemaNode";
import { SchemaRngConverter } from "../DataSchema/DataSchemaParser/SchemaRngConverter";
import { createEvent } from "../Utils/Event";
import { UriUtils } from "../Utils/UriUtils";

import { ILogger } from "./Logging/Logger";

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

export class SugarProjectIntellisenseService {
    private readonly absolutePathToProject: string;
    private readonly logger: ILogger;
    private dataSchema: DataSchemaElementNode;

    public dataSchemaChangeEvent = createEvent<[DataSchemaElementNode]>();

    public constructor(logger: ILogger, absolutePathToProject: string) {
        this.absolutePathToProject = absolutePathToProject;
        this.logger = logger;
        this.dataSchema = this.loadDataSchema();
    }

    public getDataSchema(): DataSchemaElementNode {
        return this.dataSchema;
    }

    public updateSchema(): void {
        this.dataSchema = this.loadDataSchema();
        this.dataSchemaChangeEvent.emit(this.dataSchema);
    }

    public getSchemaFileName(): string {
        const formDirName = path.basename(this.absolutePathToProject);
        const schemaFile = path.join(this.absolutePathToProject, "schemas", formDirName + ".rng.xml");
        return schemaFile;
    }

    private loadDataSchema(): DataSchemaElementNode {
        const schemaFile = this.getSchemaFileName();
        const schemaParser = new SchemaRngConverter();
        this.logger.info(`Schema is not loaded. Loading. (${this.absolutePathToProject})`);
        try {
            const schemaFileContent = fs.readFileSync(schemaFile, "utf8");
            return schemaParser.toDataSchema(schemaFileContent);
        } catch (e) {
            return emptyDataSchema;
            this.logger.info(`Failed to load schema. (${this.absolutePathToProject})`);
            // ignore read error
        }
    }
}

const emptyDataSchema: DataSchemaElementNode = {
    name: "",
    type: "DataSchemaElementNode",
    position: {
        start: { line: 0, column: 0, offset: 0 },
        end: { line: 0, column: 0, offset: 0 },
    },
};
