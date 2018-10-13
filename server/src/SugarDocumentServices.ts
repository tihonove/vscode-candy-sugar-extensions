import * as _ from "lodash";

import { CompletionItemDescriptionResolver } from "./CompletionItemDescriptionResolver";
import { DataSchemaElementNode, DataSchemaNode } from "./DataSchema/DataSchemaNode";
import { DataSchemaUtils } from "./DataSchema/DataSchemaUtils";
import { ILogger } from "./Logger/Logger";
import { ContextAtCursorResolver, CursorContext } from "./SugarCodeDomBuilder/ContextAtCursorResolver";
import { PositionToNodeMap, SugarCodeDomBuilder } from "./SugarCodeDomBuilder/SugarCodeDomBuilder";
import { allElements } from "./SugarElements/DefaultSugarElements";
import { CompletionSuggester } from "./Suggester/CompletionSuggester";
import { SugarElementInfo } from "./Suggester/SugarElementInfo";

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
    private readonly builder: SugarCodeDomBuilder;
    public map?: PositionToNodeMap;
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
        this.builder = new SugarCodeDomBuilder();
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

    public resolveContextAsOffset(offset: number): undefined | CursorContext {
        if (this.map == undefined) {
            return undefined;
        }
        const contextAtCursorResolver = new ContextAtCursorResolver(this.sugarElements);
        return contextAtCursorResolver.resolveContext(this.map, offset);
    }

    private updateDom(text: string): void {
        this.logger.info("Begin update");
        try {
            this.map = this.builder.buildPositionToNodeMap(text);
        } catch (ignoreError) {
            // По всей вимдости код невалиден. Просто оставим последний валидный map
        }

        this.logger.info("End update");
    }
}
