import * as path from "path";
import { ExtensionContext, workspace } from "vscode";

import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from "vscode-languageclient";

let client: LanguageClient;

export function activate(context: ExtensionContext): void {
    const serverModule = context.asAbsolutePath(path.join("server", "out", "ServerEntryPoint.js"));
    const debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };

    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions: ServerOptions = {
        run: { module: serverModule, transport: TransportKind.ipc },
        debug: {
            module: serverModule,
            transport: TransportKind.ipc,
            options: debugOptions,
        },
    };

    const clientOptions: LanguageClientOptions = {
        documentSelector: [{ scheme: "file", language: "sugar-xml" }, { scheme: "file", language: "xml" }],
        synchronize: {
            // Notify the server about file changes to '.clientrc files contained in the workspace
            fileEvents: workspace.createFileSystemWatcher("**/.clientrc"),
        },
    };

    client = new LanguageClient("languageServerExample", "Language Server Example", serverOptions, clientOptions);
    client.start();
}

export function deactivate(): undefined | Thenable<void> {
    if (client == undefined) {
        return undefined;
    }
    return client.stop();
}
