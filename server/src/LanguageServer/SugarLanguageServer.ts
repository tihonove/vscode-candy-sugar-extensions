import { CancellationToken } from "vscode-jsonrpc";
import {
    CompletionItem,
    Connection,
    createConnection,
    InitializeParams,
    ProposedFeatures,
    TextDocumentPositionParams,
    TextDocuments,
} from "vscode-languageserver";
import { Definition, Hover, TextDocumentChangeEvent } from "vscode-languageserver-types";

import { ILogger, VsCodeServerLogger } from "./Logger";
import { SugarDocumentIntellisenseService } from "./SugarDocumentIntellisenseService";

export class SugarLanguageServer {
    private readonly connection: Connection;
    private readonly logger: ILogger;
    private readonly documents: TextDocuments;
    private readonly documentServices: { [uri: string]: undefined | SugarDocumentIntellisenseService };

    public constructor() {
        this.connection = createConnection(ProposedFeatures.all);
        this.logger = new VsCodeServerLogger(this.connection.console);
        this.documents = new TextDocuments();
        this.documentServices = {};
        this.connection.onInitialize(this.handleInitialize);
        this.documents.onDidChangeContent(this.handleChangeDocumentContent);
        this.documents.onDidClose(this.handleCloseTextDocument);
        this.connection.onHover(this.handleHover);
        this.connection.onDefinition(this.handleResolveDefinition);
        this.connection.onCompletion(this.handleResolveCompletion);
        this.connection.onCompletionResolve(this.handleEnrichCompletionItem);
    }

    public listen(): void {
        this.documents.listen(this.connection);
        this.connection.listen();
    }

    private readonly handleCloseTextDocument = ({ document }: TextDocumentChangeEvent): void => {
        const documentService = this.documentServices[document.uri];
        if (documentService != undefined) {
            documentService.handleCloseTextDocument({ document: document });
            this.documentServices[document.uri] = undefined;
        }
    };

    private readonly handleInitialize = (_params: InitializeParams) => ({
        capabilities: {
            textDocumentSync: this.documents.syncKind,
            hoverProvider: true,
            definitionProvider: true,
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ["/"],
            },
        },
    });

    private readonly handleChangeDocumentContent = (change: TextDocumentChangeEvent) => {
        const documentUri = change.document.uri;
        if (change.document.languageId !== "sugar-xml") {
            return;
        }
        let documentService = this.documentServices[documentUri];
        if (documentService == undefined) {
            documentService = new SugarDocumentIntellisenseService(
                this.connection,
                this.logger,
                this.documents,
                documentUri
            );
            this.documentServices[documentUri] = documentService;
        }
        documentService.handleChangeDocumentContent(change);
    };

    private readonly handleHover = (positionParams: TextDocumentPositionParams): undefined | Hover => {
        const documentService = this.documentServices[positionParams.textDocument.uri];
        if (documentService != undefined) {
            return documentService.handleHover(positionParams);
        }
        return undefined;
    };

    private readonly handleResolveDefinition = (positionParams: TextDocumentPositionParams): undefined | Definition => {
        const documentService = this.documentServices[positionParams.textDocument.uri];
        if (documentService != undefined) {
            return documentService.handleResolveDefinition(positionParams);
        }
        return undefined;
    };

    private readonly handleResolveCompletion = (
        textDocumentPosition: TextDocumentPositionParams,
        _token: CancellationToken
    ): CompletionItem[] => {
        const documentService = this.documentServices[textDocumentPosition.textDocument.uri];
        if (documentService != undefined) {
            return documentService.handleResolveCompletion(textDocumentPosition, _token);
        }
        return [];
    };

    private readonly handleEnrichCompletionItem = (item: CompletionItem): CompletionItem => {
        // tslint:disable-next-line no-unsafe-any
        const { uri } = item.data;
        const documentService = this.documentServices[uri];
        if (documentService != undefined) {
            return documentService.handleEnrichCompletionItem(item);
        }
        return item;
    };
}
