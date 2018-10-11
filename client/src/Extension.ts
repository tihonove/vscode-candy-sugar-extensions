import { commands, ExtensionContext, window, workspace } from "vscode";
import { LanguageClient } from "vscode-languageclient";

import { insertAutoCloseTag, insertCloseTag } from "./AutoCloseTag";
import { startSugarLanguageServer, stopLanguageServer } from "./SugarLanguageClient";

let languageClient: LanguageClient;

export function activate(context: ExtensionContext): void {
    languageClient = startSugarLanguageServer(context);

    workspace.onDidChangeTextDocument(event => {
        insertAutoCloseTag(window.activeTextEditor, event);
    });

    const closeTag = commands.registerCommand("auto-close-tag.closeTag", () => {
        insertCloseTag(window.activeTextEditor);
    });

    context.subscriptions.push(closeTag);
}

export async function deactivate(): Promise<void> {
    await stopLanguageServer(languageClient);
}
