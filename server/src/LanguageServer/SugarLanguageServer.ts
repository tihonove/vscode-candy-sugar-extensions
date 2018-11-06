import { CancellationToken, RequestType } from "vscode-jsonrpc";
import {
    CodeLens,
    CodeLensParams,
    CompletionItem,
    Connection,
    createConnection,
    DidChangeConfigurationNotification,
    DidChangeWatchedFilesParams,
    InitializeParams,
    InitializeResult,
    Location,
    ProposedFeatures,
    ReferenceParams,
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
        this.connection.onRequest(
            new RequestType<[string, number], undefined | string, Error, void>("resolveHelpPage"),
            this.handlerResolveHelpPage
        );
        this.connection.onCodeLens(this.handleProvideCodeLenses);
        this.connection.onCodeLensResolve(this.handleResolveCodeLens);
        this.connection.onReferences(this.handleFindAllReferences);
    }

    public listen(): void {
        this.documents.listen(this.connection);
        this.connection.listen();
        this.connection.client.register(DidChangeConfigurationNotification.type, undefined);
        this.connection.onDidChangeWatchedFiles(this.handleChangeWatchedFiles);
    }

    private readonly handleChangeWatchedFiles = (params: DidChangeWatchedFilesParams): void => {
        for (const documentUri of Object.keys(this.documentServices)) {
            const documentService = this.documentServices[documentUri];
            if (documentService != undefined) {
                for (const uri of params.changes.map(x => x.uri)) {
                    if (documentService.isLinkedWithSchemaFile(uri)) {
                        documentService.updateSchema();
                        const textDocument = this.documents.get(documentUri);
                        if (textDocument != undefined) {
                            documentService.validateTextDocument(textDocument.getText());
                        }
                    }
                }
            }
        }
    };

    private readonly handleFindAllReferences = (params: ReferenceParams): undefined | Location[] => {
        const documentService = this.documentServices[params.textDocument.uri];
        if (documentService != undefined) {
            return documentService.findAllReferences(params.position);
        }
        return undefined;
    };

    private readonly handleResolveCodeLens = (lens: CodeLens): CodeLens => lens;

    private readonly handleProvideCodeLenses = async ({
        textDocument,
    }: CodeLensParams): Promise<CodeLens[] | undefined | null> => {
        this.logger.info("Code lens requested");
        const documentService = this.documentServices[textDocument.uri];
        const document = this.documents.get(textDocument.uri);
        if (documentService != undefined && document != undefined) {
            documentService.updateDomDebounced(document.getText());
            await documentService.ensureCodeDomUpdated();
            this.logger.info("Code lens awaited update");
            return documentService.getCodeLenses();
        }
        return undefined;
    };

    private readonly handlerResolveHelpPage = ([documentUri, caretOffset]: [string, number]): undefined | string => {
        const documentService = this.documentServices[documentUri];
        if (documentService != undefined) {
            return documentService.getHelpUrlForCurrentPosition(caretOffset);
        }
        return "";
    };

    private readonly handleCloseTextDocument = ({ document }: TextDocumentChangeEvent): void => {
        const documentService = this.documentServices[document.uri];
        if (documentService != undefined) {
            documentService.handleCloseTextDocument({ document: document });
            this.documentServices[document.uri] = undefined;
        }
    };

    private readonly handleInitialize = (_params: InitializeParams): InitializeResult => ({
        capabilities: {
            textDocumentSync: this.documents.syncKind,
            hoverProvider: true,
            definitionProvider: true,
            referencesProvider: true,
            completionProvider: {
                resolveProvider: true,
                triggerCharacters: ["/"],
            },
            codeLensProvider: {
                resolveProvider: true,
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
        this.logger.info("Begin process change");
        documentService.processChangeDocumentContent(change.document.getText());
        this.logger.info("End process change");
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
