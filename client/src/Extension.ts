import opn from "opn";
import { commands, ExtensionContext, Selection, window, workspace } from "vscode";
import { RequestType } from "vscode-jsonrpc";
import { LanguageClient } from "vscode-languageclient";

import { insertAutoCloseTag, insertCloseTag } from "./AutoCloseTag";
import { startSugarLanguageServer, stopLanguageServer } from "./SugarLanguageClient";
import { asPromise } from "./TypingUtils";

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

    const someCommand = commands.registerCommand(
        "vscode-candy-sugar.open-usages-at-offset",
        async (offset: number): Promise<void> => {
            const activeTextEditor = window.activeTextEditor;
            if (activeTextEditor != undefined) {
                const position = activeTextEditor.document.positionAt(offset);
                const oldSelections = activeTextEditor.selections;
                activeTextEditor.selection = new Selection(position, position);
                await asPromise(commands.executeCommand("editor.action.referenceSearch.trigger"));
                activeTextEditor.selections = oldSelections;
            }
        }
    );

    const openHelpPage = commands.registerCommand("vscode-candy-sugar.open-help-page", async () => {
        if (window.activeTextEditor == undefined) {
            return;
        }
        if (window.activeTextEditor.document.languageId !== "sugar-xml") {
            return;
        }
        try {
            const caretOffset = window.activeTextEditor.document.offsetAt(window.activeTextEditor.selection.start);
            const result = await asPromise(
                languageClient.sendRequest(new RequestType<[string, number], string, Error, void>("resolveHelpPage"), [
                    window.activeTextEditor.document.uri.toString(),
                    caretOffset,
                ])
            );
            if (result != undefined) {
                opn(result);
            }
        } catch (ignoreError) {
            // ignore error
        }
    });

    context.subscriptions.push(closeTag);
    context.subscriptions.push(openHelpPage);
    context.subscriptions.push(someCommand);
}

export async function deactivate(): Promise<void> {
    await stopLanguageServer(languageClient);
}
