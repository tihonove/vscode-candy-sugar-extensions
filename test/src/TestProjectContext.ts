import { DataSchemaElementNode } from "../../server/src/DataSchema/DataSchemaNode";
import { OffsetToNodeMapBuilder } from "../../server/src/SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMapBuilder";
import { TypeInfoExtractor } from "../../server/src/SugarAnalyzing/TypeInfoExtraction/TypeInfoExtractor";
import { SugarElementInfo } from "../../server/src/SugarElements/SugarElementInfo";
import { UserDefinedSugarTypeInfo } from "../../server/src/SugarElements/UserDefinedSugarTypeInfo";
import { SugarElement } from "../../server/src/SugarParsing/SugarGrammar/SugarParser";
import { ISugarProjectContext } from "../../server/src/Validator/Validator/ISugarProjectContext";

import { testDataSchema, testSugarElementInfos } from "./Utils/TestInfos";

export class TestProjectContext implements ISugarProjectContext {
    private readonly sugarFileDoms: {
        [filePath: string]: { sugarDom: SugarElement; userDefinedTypes: UserDefinedSugarTypeInfo[] };
    };

    public constructor(sugarFileDoms: { [filePath: string]: SugarElement | string }) {
        const mapBuilder = new OffsetToNodeMapBuilder();
        const typeInfoExtractor = new TypeInfoExtractor();

        this.sugarFileDoms = {};
        for (const fileName of Object.keys(sugarFileDoms)) {
            const sugarContextOrDom = sugarFileDoms[fileName];
            if (typeof sugarContextOrDom === "string") {
                const sugarDom = mapBuilder.buildCodeDom(sugarContextOrDom);
                this.sugarFileDoms[fileName] = {
                    sugarDom: sugarDom,
                    userDefinedTypes: typeInfoExtractor.extractTypeInfos(sugarDom, fileName),
                };
            } else {
                this.sugarFileDoms[fileName] = {
                    sugarDom: sugarContextOrDom,
                    userDefinedTypes: typeInfoExtractor.extractTypeInfos(sugarContextOrDom, fileName),
                };
            }
        }
    }

    public getAllUserDefinedTypes(): UserDefinedSugarTypeInfo[] {
        return Object.values(this.sugarFileDoms)
            .map(x => x.userDefinedTypes)
            .reduce((x, y) => x.concat(y), []);
    }

    public getDataSchema(): DataSchemaElementNode | undefined {
        return testDataSchema;
    }

    public getSugarElementInfos(): SugarElementInfo[] {
        return testSugarElementInfos;
    }

    public getAllProjectFilePaths(): string[] {
        return Object.keys(this.sugarFileDoms);
    }

    public getSugarDomByFilePath(absoluteSugarFilePath: string): SugarElement {
        if (this.sugarFileDoms[absoluteSugarFilePath] == undefined) {
            throw new Error(`File ${absoluteSugarFilePath} not in project`);
        }
        return this.sugarFileDoms[absoluteSugarFilePath].sugarDom;
    }
}
