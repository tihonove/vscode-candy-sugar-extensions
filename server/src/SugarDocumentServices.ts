import * as _ from "lodash";

import { DataSchemaElementNode, DataSchemaNode } from "./DataSchema/DataSchemaNode";
import { DataSchemaUtils } from "./DataSchema/DataSchemaUtils";
import { CompletionItemDescriptionResolver } from "./LanguageServer/CompletionItemDescriptionResolver";
import { ILogger } from "./LanguageServer/Logger";
import { CodeContext } from "./SugarAnalyzing/CodeContext";
import { CodeContextByNodeResolver } from "./SugarAnalyzing/CodeContextByNodeResolver";
import { CompletionSuggester } from "./SugarAnalyzing/CompletionSuggester";
import { OffsetToNodeMap } from "./SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMap";
import { OffsetToNodeMapBuilder } from "./SugarAnalyzing/OffsetToNodeMaping/OffsetToNodeMapBuilder";
import { allElements } from "./SugarElements/DefaultSugarElementInfos/DefaultSugarElements";
import { SugarElementInfo } from "./SugarElements/SugarElementInfo";

export class SugarDocumentServices {
    public suggester: CompletionSuggester;
    public descriptionResolver: CompletionItemDescriptionResolver;
    public sugarDocumentDom: SugarDocumentDom;

    public constructor(
        schemaFileUri: string,
        dataSchemaRootNode: DataSchemaElementNode,
        sugarElements: SugarElementInfo[],
        logger: ILogger
    ) {
        this.suggester = new CompletionSuggester([], allElements, dataSchemaRootNode);
        this.descriptionResolver = new CompletionItemDescriptionResolver(dataSchemaRootNode);
        this.sugarDocumentDom = new SugarDocumentDom(schemaFileUri, logger, dataSchemaRootNode, sugarElements);
    }
}

class SugarDocumentDom {
    private readonly logger: ILogger;
    private readonly updateDomDebounced = _.debounce((text: string) => this.updateDom(text), 50, { trailing: true });
    private readonly builder: OffsetToNodeMapBuilder;
    public map?: OffsetToNodeMap;
    private readonly sugarElements: SugarElementInfo[];
    private readonly dataSchemaRootNode: DataSchemaElementNode;
    private readonly schemaFileUri: string;

    public constructor(
        schemaFileUri: string,
        logger: ILogger,
        dataSchemaRootNode: DataSchemaElementNode,
        sugarElements: SugarElementInfo[]
    ) {
        this.schemaFileUri = schemaFileUri;
        this.logger = logger;
        this.builder = new OffsetToNodeMapBuilder();
        this.sugarElements = sugarElements;
        this.dataSchemaRootNode = dataSchemaRootNode;
    }

    public processDocumentChange(text: string): void {
        this.updateDomDebounced(text);
    }

    public getDataElementOrAttributeByPath(path: string[]): undefined | DataSchemaNode {
        return DataSchemaUtils.findSchemaNodeByPath(this.dataSchemaRootNode, path);
    }

    public getDataSchemaUri(): undefined | string {
        return this.schemaFileUri;
    }

    public resolveContextAsOffset(offset: number): undefined | CodeContext {
        if (this.map == undefined) {
            return undefined;
        }
        const contextAtCursorResolver = new CodeContextByNodeResolver(this.sugarElements);
        const node = this.map.getNodeByOffset(offset);
        if (node == undefined) {
            return undefined;
        }
        return contextAtCursorResolver.resolveContext(node);
    }

    private updateDom(text: string): void {
        this.logger.info("Begin update");
        try {
            this.map = this.builder.buildOffsetToNodeMap(text);
        } catch (ignoreError) {
            // По всей вимдости код невалиден. Просто оставим последний валидный map
        }

        this.logger.info("End update");
    }
}
