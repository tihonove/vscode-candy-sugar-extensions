import * as path from "path";
import { ExtensionContext, workspace } from "vscode";
import { LanguageClient, LanguageClientOptions, ServerOptions, TransportKind } from "vscode-languageclient";

import { asPromise } from "./TypingUtils";

export function startSugarLanguageServer(context: ExtensionContext): LanguageClient {
    const serverModule = context.asAbsolutePath(path.join("server", "out", "ServerEntryPoint.js"));
    const debugOptions = { execArgv: ["--nolazy", "--inspect=6009"] };

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
            configurationSection: "candySugarExtension",
            fileEvents: workspace.createFileSystemWatcher("**/*.rng.xml"),
        },
    };

    const client = new LanguageClient("languageServerExample", "Language Server Example", serverOptions, clientOptions);
    client.start();
    return client;
}

export async function stopLanguageServer(client?: LanguageClient): Promise<void> {
    if (client != undefined) {
        await asPromise(client.stop());
    }
}
