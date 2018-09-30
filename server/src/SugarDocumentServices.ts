import { DataSchemaNode } from "./DataShema/DataSchemaNode";
import { allElements } from "./SugarElements/DefaultSugarElements";
import { CompletionSuggester } from "./Suggester/CompletionSuggester";
import { CompletionItemDescriptionResolver } from "./CompletionItemDescriptionResolver";

export class SugarDocumentServices {
    public suggester: CompletionSuggester;
    public descriptionResolver: CompletionItemDescriptionResolver;

    public constructor(dataSchemaRootNode: DataSchemaNode) {
        this.suggester = new CompletionSuggester([], allElements, dataSchemaRootNode);
        this.descriptionResolver = new CompletionItemDescriptionResolver(dataSchemaRootNode);
    }
}

