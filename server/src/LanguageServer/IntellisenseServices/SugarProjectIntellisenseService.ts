import * as fs from "fs";
import path from "path";

import { DataSchemaElementNode } from "../../DataSchema/DataSchemaNode";
import { SchemaRngConverter } from "../../DataSchema/DataSchemaParser/SchemaRngConverter";
import { OffsetToNodeMapBuilder } from "../../SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMapBuilder";
import { TemplatesExtractor } from "../../SugarAnalyzing/TemplatesExtraction/TemplatesExtractor";
import { TypeInfoExtractor } from "../../SugarAnalyzing/TypeInfoExtraction/TypeInfoExtractor";
import { standardElements } from "../../SugarElements/SugarElements";
import { SugarElementInfo } from "../../SugarElements/SugarElementInfo";
import { UserDefinedSugarTemplateInfo } from "../../SugarElements/UserDefinedSugarTemplateInfo";
import { UserDefinedSugarTypeInfo } from "../../SugarElements/UserDefinedSugarTypeInfo";
import { SugarElement } from "../../SugarParsing/SugarGrammar/SugarParser";
import { createEvent } from "../../Utils/Event";
import { isNotNullOrUndefined } from "../../Utils/TypingUtils";
import { UriUtils } from "../../Utils/UriUtils";
import { ISugarProjectContext } from "../../Validator/Validator/ISugarProjectContext";
import { ILogger } from "../Logging/Logger";

export class SugarProjectIntellisenseService implements ISugarProjectContext {
    private readonly absolutePathToProject: string;
    private readonly logger: ILogger;
    private dataSchema: DataSchemaElementNode;
    private readonly typeInfoExtractor: TypeInfoExtractor;
    private readonly templatesExtractor: TemplatesExtractor;
    private readonly templatesElementInfos: {
        [sugarDocumentUri: string]: {
            elements: SugarElementInfo[];
            templates: UserDefinedSugarTemplateInfo[];
        };
    } = {};
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
        this.templatesExtractor = new TemplatesExtractor();
        this.builder = new OffsetToNodeMapBuilder();
        this.loadUserDefinedTypesFromDisk();
        this.loadUserDefinedTemplatesFromDisk();
    }

    public get userDefinedTypes(): UserDefinedSugarTypeInfo[] {
        return Object.values(this.documentsUserDefinedTypes)
            .filter(isNotNullOrUndefined)
            .reduce((x, y) => x.concat(y), []);
    }

    public get userDefinedTemplateElements(): SugarElementInfo[] {
        return Object.values(this.templatesElementInfos)
            .filter(isNotNullOrUndefined)
            .map(x => x.elements)
            .reduce((x, y) => x.concat(y), []);
    }

    public get userDefinedTemplateSource(): UserDefinedSugarTemplateInfo[] {
        return Object.values(this.templatesElementInfos)
            .filter(isNotNullOrUndefined)
            .map(x => x.templates)
            .reduce((x, y) => x.concat(y), []);
    }

    public getUserDefinedTypesBySugarFile(documentUri: string): undefined | UserDefinedSugarTypeInfo[] {
        const sugarFileName = path.basename(UriUtils.toFileName(documentUri));
        return this.documentsUserDefinedTypes[sugarFileName];
    }

    public getUserDefinedElementsBySugarFile(documentUri: string): undefined | SugarElementInfo[] {
        const sugarFileName = path.basename(UriUtils.toFileName(documentUri));
        return this.templatesElementInfos[sugarFileName].elements;
    }

    public getUserDefinedTemplatesBySugarFile(documentUri: string): undefined | UserDefinedSugarTemplateInfo[] {
        const sugarFileName = path.basename(UriUtils.toFileName(documentUri));
        return this.templatesElementInfos[sugarFileName].templates;
    }

    public updateDocumentDom(documentUri: string, sugarDocument: SugarElement): void {
        const absoluteSugarFilePath = UriUtils.toFileName(documentUri);
        const userDefinedTypes = this.typeInfoExtractor.extractTypeInfos(sugarDocument, absoluteSugarFilePath);
        this.documentsDoms[absoluteSugarFilePath] = sugarDocument;
        const sugarFileName = path.basename(absoluteSugarFilePath);
        this.documentsUserDefinedTypes[sugarFileName] = userDefinedTypes;
        this.templatesElementInfos[sugarFileName] = {
            elements: this.templatesExtractor.extractElements(sugarDocument),
            templates: this.templatesExtractor.extractTemplates(sugarDocument, absoluteSugarFilePath),
        };
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
        return [...standardElements, ...this.userDefinedTemplateElements];
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
        this.loadFile((sugarDocument, absoluteSugarFilePath) => {
            const sugarFileName = path.basename(absoluteSugarFilePath);
            const userDefinedTypes = this.typeInfoExtractor.extractTypeInfos(sugarDocument, sugarFileName);
            this.documentsUserDefinedTypes[sugarFileName] = userDefinedTypes;
        });
    }

    private loadUserDefinedTemplatesFromDisk(): void {
        this.loadFile((sugarDocument, absoluteSugarFilePath) => {
            const sugarFileName = path.basename(absoluteSugarFilePath);
            this.templatesElementInfos[sugarFileName] = {
                elements: this.templatesExtractor.extractElements(sugarDocument),
                templates: this.templatesExtractor.extractTemplates(sugarDocument, sugarFileName),
            };
        });
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

    private loadFile(callback: (sugarDocument: SugarElement, sugarFileName: string) => void): void {
        const sugarFileNames = this.getAllSugarFileNames();
        for (const sugarFileName of sugarFileNames) {
            try {
                const fileContent = fs.readFileSync(sugarFileName, "utf8");
                const sugarDocument = this.builder.buildCodeDom(fileContent);
                this.documentsDoms[sugarFileName] = sugarDocument;
                callback(sugarDocument, sugarFileName);
            } catch (ignoreError) {
                // ignore error
            }
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
