import { commands, ExtensionContext, window, workspace } from "vscode";
import { LanguageClient } from "vscode-languageclient";

import { insertAutoCloseTag, insertCloseTag } from "./AutoCloseTag";
import { startSugarLanguageServer, stopLanguageServer } from "./SugarLanguageClient";

let languageClient: LanguageClient;

export function activate(context: ExtensionContext): void {
    languageClient = startSugarLanguageServer(context);

    workspace.onDidChangeTextDocument(event => {
        if (window.activeTextEditor == undefined) {
            return;
        }
        if (window.activeTextEditor.document.languageId !== "sugar-xml") {
            return;
        }
        insertAutoCloseTag(window.activeTextEditor, event);
    });

    const closeTag = commands.registerCommand("vscode-candy-sugar.closeTag", () => {
        insertCloseTag(window.activeTextEditor);
    });

    context.subscriptions.push(closeTag);
}

export async function deactivate(): Promise<void> {
    await stopLanguageServer(languageClient);
}
