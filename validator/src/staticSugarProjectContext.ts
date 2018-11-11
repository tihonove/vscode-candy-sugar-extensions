import * as fs from "fs";
import path from "path";

import { DataSchemaElementNode } from "../../server/src/DataSchema/DataSchemaNode";
import { SchemaRngConverter } from "../../server/src/DataSchema/DataSchemaParser/SchemaRngConverter";
import { OffsetToNodeMapBuilder } from "../../server/src/SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMapBuilder";
import { TypeInfoExtractor } from "../../server/src/SugarAnalyzing/TypeInfoExtraction/TypeInfoExtractor";
import { allElements } from "../../server/src/SugarElements/DefaultSugarElementInfos/DefaultSugarElements";
import { SugarElementInfo } from "../../server/src/SugarElements/SugarElementInfo";
import { UserDefinedSugarTypeInfo } from "../../server/src/SugarElements/UserDefinedSugarTypeInfo";
import { SugarElement } from "../../server/src/SugarParsing/SugarGrammar/SugarParser";
import { isNotNullOrUndefined } from "../../server/src/Utils/TypingUtils";
import { ISugarProjectContext } from "../../server/src/Validator/Validator/ISugarProjectContext";

export class StaticSugarProjectContext implements ISugarProjectContext {
    private readonly absolutePathToProject: string;
    private readonly dataSchema: DataSchemaElementNode;
    private readonly documentsUserDefinedTypes: {
        [sugarDocumentUri: string]: undefined | UserDefinedSugarTypeInfo[];
    } = {};
    private readonly documentsDoms: { [sugarDocumentUri: string]: undefined | SugarElement } = {};

    public constructor(absolutePathToProject: string) {
        this.absolutePathToProject = absolutePathToProject;
        this.dataSchema = this.loadDataSchema();
        this.loadUserDefinedTypesFromDisk();
    }

    public getAllProjectFilePaths(): string[] {
        return Object.keys(this.documentsDoms);
    }

    public getAllUserDefinedTypes(): UserDefinedSugarTypeInfo[] {
        return Object.values(this.documentsUserDefinedTypes)
            .filter(isNotNullOrUndefined)
            .reduce((x, y) => x.concat(y), []);
    }

    public getDataSchema(): DataSchemaElementNode | undefined {
        return this.dataSchema;
    }

    public getSugarDomByFilePath(absoluteSugarFilePath: string): SugarElement {
        const result = this.documentsDoms[absoluteSugarFilePath];
        if (result == undefined) {
            throw new Error(`Error ${absoluteSugarFilePath} not in project`);
        }
        return result;
    }

    public getSugarElementInfos(): SugarElementInfo[] {
        return allElements;
    }

    public getSchemaFileName(): string {
        const formDirName = path.basename(this.absolutePathToProject);
        const schemaFile = path.join(this.absolutePathToProject, "schemas", formDirName + ".rng.xml");
        return schemaFile;
    }

    private loadDataSchema(): DataSchemaElementNode {
        const schemaFile = this.getSchemaFileName();
        const schemaParser = new SchemaRngConverter();
        try {
            const schemaFileContent = fs.readFileSync(schemaFile, "utf8");
            return schemaParser.toDataSchema(schemaFileContent);
        } catch (e) {
            // ignore read error
            return emptyDataSchema;
        }
    }

    private getAllSugarFileNames(): string[] {
        const directoryWithSugarFiles = path.join(this.absolutePathToProject, "sugar");
        const fileNames = fs.readdirSync(directoryWithSugarFiles);
        return fileNames
            .filter(x => x.endsWith(".sugar.xml"))
            .map(x => path.resolve(path.join(directoryWithSugarFiles, x)));
    }

    private loadUserDefinedTypesFromDisk(): void {
        const builder = new OffsetToNodeMapBuilder();
        const typeInfoExtractor = new TypeInfoExtractor();

        const sugarFileNames = this.getAllSugarFileNames();
        for (const sugarFileName of sugarFileNames) {
            try {
                const fileContent = fs.readFileSync(sugarFileName, "utf8");
                const sugarDocument = builder.buildCodeDom(fileContent);
                this.documentsDoms[sugarFileName] = sugarDocument;
                const userDefinedTypes = typeInfoExtractor.extractTypeInfos(sugarDocument, sugarFileName);
                this.documentsUserDefinedTypes[sugarFileName] = userDefinedTypes;
            } catch (ignoreError) {
                // ignore read error
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
