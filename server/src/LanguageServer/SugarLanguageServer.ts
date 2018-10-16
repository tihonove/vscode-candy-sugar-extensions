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
import { Definition, Hover, Position, TextDocumentChangeEvent } from "vscode-languageserver-types";

import { ILogger } from "./Logging/Logger";
import { VsCodeServerLogger } from "./Logging/VsCodeServerLogger";
import { IDocumentOffsetPositionResolver, SugarDocumentIntellisenseService } from "./SugarDocumentIntellisenseService";

class DocumentOffsetPositionResolver implements IDocumentOffsetPositionResolver {
    private readonly documents: TextDocuments;
    private readonly documentUri: string;

    public constructor(documents: TextDocuments, documentUri: string) {
        this.documents = documents;
        this.documentUri = documentUri;
    }

    public offsetAt(position: Position): number {
        const document = this.documents.get(this.documentUri);
        if (document == undefined) {
            throw new Error(`Document with uri '${this.documentUri}' does not exists in observer documents`);
        }
        return document.offsetAt(position);
    }

    public positionAt(offset: number): Position {
        const document = this.documents.get(this.documentUri);
        if (document == undefined) {
            throw new Error(`Document with uri '${this.documentUri}' does not exists in observer documents`);
        }
        return document.positionAt(offset);
    }
}

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
            documentService = this.createSugarDocumentIntellisenseService(documentUri);
            this.documentServices[documentUri] = documentService;
        }
        documentService.processChangeDocumentContent(change.document.getText());
    };

    private createSugarDocumentIntellisenseService(documentUri: string): SugarDocumentIntellisenseService {
        const result = new SugarDocumentIntellisenseService(
            this.logger,
            documentUri,
            new DocumentOffsetPositionResolver(this.documents, documentUri)
        );

        result.sendValidationsEvent.addListener(validations => {
            this.connection.sendDiagnostics({
                uri: documentUri,
                diagnostics: validations,
            });
        });

        return result;
    }

    private readonly handleHover = (positionParams: TextDocumentPositionParams): undefined | Hover => {
        const documentService = this.documentServices[positionParams.textDocument.uri];
        if (documentService != undefined) {
            return documentService.getHoverInfoAtPosition(positionParams.position);
        }
        return undefined;
    };

    private readonly handleResolveDefinition = (positionParams: TextDocumentPositionParams): undefined | Definition => {
        const documentService = this.documentServices[positionParams.textDocument.uri];
        if (documentService != undefined) {
            return documentService.getSymbolDefinitionAtPosition(positionParams.position);
        }
        return undefined;
    };

    private readonly handleResolveCompletion = (
        textDocumentPosition: TextDocumentPositionParams,
        _token: CancellationToken
    ): CompletionItem[] => {
        const text = this.documents.get(textDocumentPosition.textDocument.uri);
        if (text == undefined) {
            return [];
        }
        const textToCursor = text.getText({
            start: text.positionAt(0),
            end: textDocumentPosition.position,
        });
        const documentService = this.documentServices[textDocumentPosition.textDocument.uri];
        if (documentService != undefined) {
            return documentService.getCompletionAfterText(textToCursor);
        }
        return [];
    };

    private readonly handleEnrichCompletionItem = (item: CompletionItem): CompletionItem => {
        // tslint:disable-next-line no-unsafe-any
        const { uri } = item.data;
        const documentService = this.documentServices[uri];
        if (documentService != undefined) {
            return documentService.enrichCompletionItem(item);
        }
        return item;
    };
}
