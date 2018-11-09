import * as fs from "fs";
import path from "path";

import { DataSchemaElementNode } from "../../DataSchema/DataSchemaNode";
import { SchemaRngConverter } from "../../DataSchema/DataSchemaParser/SchemaRngConverter";
import { OffsetToNodeMapBuilder } from "../../SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMapBuilder";
import { TypeInfoExtractor } from "../../SugarAnalyzing/TypeInfoExtraction/TypeInfoExtractor";
import { allElements } from "../../SugarElements/DefaultSugarElementInfos/DefaultSugarElements";
import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
import { createEvent } from "../../Utils/Event";
import { UriUtils } from "../../Utils/UriUtils";
import { ISugarProjectContext } from "../../Validator/Validator/ISugarProjectContext";

import { isNotNullOrUndefined } from "../../Utils/TypingUtils";
import { ILogger } from "../Logging/Logger";

export class SugarProjectIntellisenseService implements ISugarProjectContext {
    private readonly absolutePathToProject: string;
    private readonly logger: ILogger;
    private dataSchema: DataSchemaElementNode;
    private readonly typeInfoExtractor: TypeInfoExtractor;
    private readonly builder: OffsetToNodeMapBuilder;
    private readonly documentsDoms: { [sugarDocumentUri: string]: undefined | SugarElement } = {};
    private readonly documentsUserDefinedTypes: {
        [sugarDocumentUri: string]: undefined | UserDefinedSugarTypeInfo[];
    } = {};
    public dataSchemaChangeEvent = createEvent<[DataSchemaElementNode]>();

    public constructor(logger: ILogger, absolutePathToProject: string) {
        this.absolutePathToProject = absolutePathToProject;
        this.logger = logger;
        this.dataSchema = this.loadDataSchema();
        this.typeInfoExtractor = new TypeInfoExtractor();
        this.builder = new OffsetToNodeMapBuilder();
        this.loadUserDefinedTypesFromDisk();
    }

    public get userDefinedTypes(): UserDefinedSugarTypeInfo[] {
        return Object.values(this.documentsUserDefinedTypes)
            .filter(isNotNullOrUndefined)
            .reduce((x, y) => x.concat(y), []);
    }

    public getUserDefinedTypesBySugarFile(documentUri: string): undefined | UserDefinedSugarTypeInfo[] {
        const sugarFileName = path.basename(UriUtils.toFileName(documentUri));
        return this.documentsUserDefinedTypes[sugarFileName];
    }

    public updateDocumentDom(documentUri: string, sugarDocument: SugarElement): void {
        const absoluteSugarFilePath = UriUtils.toFileName(documentUri);
        const userDefinedTypes = this.typeInfoExtractor.extractTypeInfos(sugarDocument, absoluteSugarFilePath);
        this.documentsDoms[absoluteSugarFilePath] = sugarDocument;
        const sugarFileName = path.basename(absoluteSugarFilePath);
        this.documentsUserDefinedTypes[sugarFileName] = userDefinedTypes;
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

    public getAllUserDefinedTypes(): UserDefinedSugarTypeInfo[] {
        return this.userDefinedTypes;
    }

    public getSugarElementInfos(): SugarElementInfo[] {
        return allElements;
    }

    public getAllProjectFilePaths(): string[] {
        return Object.keys(this.documentsDoms);
    }

    public getSugarDomByFilePath(absoluteSugarFilePath: string): SugarElement {
        const result = this.documentsDoms[absoluteSugarFilePath];
        if (result == undefined) {
            throw new Error(`Error ${absoluteSugarFilePath} not in project`);
        }
        return result;
    }

    private loadUserDefinedTypesFromDisk(): void {
        const sugarFileNames = this.getAllSugarFileNames();
        for (const sugarFileName of sugarFileNames) {
            const fileContent = fs.readFileSync(sugarFileName, "utf8");
            const sugarDocument = this.builder.buildCodeDom(fileContent);
            this.documentsDoms[sugarFileName] = sugarDocument;
            const userDefinedTypes = this.typeInfoExtractor.extractTypeInfos(sugarDocument, sugarFileName);
            this.documentsUserDefinedTypes[sugarFileName] = userDefinedTypes;
        }
    }

    private getAllSugarFileNames(): string[] {
        const directoryWithSugarFiles = path.join(this.absolutePathToProject, "sugar");
        const fileNames = fs.readdirSync(directoryWithSugarFiles);
        return fileNames
            .filter(x => x.endsWith(".sugar.xml"))
            .map(x => path.resolve(path.join(directoryWithSugarFiles, x)));
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
