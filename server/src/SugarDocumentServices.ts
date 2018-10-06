import * as _ from "lodash";

import { CompletionItemDescriptionResolver } from "./CompletionItemDescriptionResolver";
import { DataSchemaNode } from "./DataShema/DataSchemaNode";
import { ILogger } from "./Logger/Logger";
import { allElements } from "./SugarElements/DefaultSugarElements";
import { CompletionSuggester } from "./Suggester/CompletionSuggester";
import { PositionToNodeMap, SugarCodeDomBuilder } from "./SugarCodeDomBuilder/SugarCodeDomBuilder";

export class SugarDocumentServices {
    public suggester: CompletionSuggester;
    public descriptionResolver: CompletionItemDescriptionResolver;
    public sugarDocumentDom: SugarDocumentDom;

    public constructor(dataSchemaRootNode: DataSchemaNode, logger: ILogger) {
        this.suggester = new CompletionSuggester([], allElements, dataSchemaRootNode);
        this.descriptionResolver = new CompletionItemDescriptionResolver(dataSchemaRootNode);
        this.sugarDocumentDom = new SugarDocumentDom(logger);
    }
}

class SugarDocumentDom {
    private readonly logger: ILogger;
    private readonly updateDomDebounced = _.debounce((text: string) => this.updateDom(text), 50, { trailing: true });
    private readonly builder: SugarCodeDomBuilder;
    public map?: PositionToNodeMap;

    public constructor(logger: ILogger) {
        this.logger = logger;
        this.builder = new SugarCodeDomBuilder();
    }

    public processDocumentChange(text: string): void {
        this.updateDomDebounced(text);
    }

    private updateDom(text: string): void {
        this.logger.info("Updated");
        this.map = this.builder.buildPositionToNodeMap(text);
    }
}
