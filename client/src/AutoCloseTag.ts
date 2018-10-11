import {
    Position,
    Range,
    Selection,
    TextDocumentChangeEvent,
    TextDocumentContentChangeEvent,
    TextEditor,
} from "vscode";

export function insertAutoCloseTag(activeTextEditor: undefined | TextEditor, event: TextDocumentChangeEvent): void {
    if (!event.contentChanges[0]) {
        return;
    }
    const isRightAngleBracket = checkRightAngleBracket(event.contentChanges[0]);
    if (!isRightAngleBracket && event.contentChanges[0].text !== "/") {
        return;
    }

    if (!activeTextEditor) {
        return;
    }

    const languageId = activeTextEditor.document.languageId;
    if (languageId !== "sugar-xml") {
        return;
    }

    const selection = activeTextEditor.selection;
    const originalPosition = selection.start.translate(0, 1);
    const excludedTags: string[] = [];
    const isSublimeText3Mode = false;
    const enableAutoCloseSelfClosingTag = true;
    const isFullMode = true;

    if ((isSublimeText3Mode || isFullMode) && event.contentChanges[0].text === "/") {
        const text = activeTextEditor.document.getText(new Range(new Position(0, 0), originalPosition));
        let last2chars = "";
        if (text.length > 2) {
            last2chars = text.substr(text.length - 2);
        }
        if (last2chars === "</") {
            const closeTag = getCloseTag(text, excludedTags);
            if (closeTag != undefined) {
                const nextChar = getNextChar(activeTextEditor, originalPosition);
                const tagToClose = nextChar === ">" ? closeTag.substr(0, closeTag.length - 1) : closeTag;
                activeTextEditor
                    .edit(editBuilder => {
                        editBuilder.insert(originalPosition, tagToClose);
                    })
                    .then(() => {
                        if (nextChar === ">") {
                            activeTextEditor.selection = moveSelectionRight(activeTextEditor.selection, 1);
                        }
                    });
            }
        }
    }

    if (
        ((!isSublimeText3Mode || isFullMode) && isRightAngleBracket) ||
        (enableAutoCloseSelfClosingTag && event.contentChanges[0].text === "/")
    ) {
        const textLine = activeTextEditor.document.lineAt(selection.start);
        const text = textLine.text.substring(0, selection.start.character + 1);
        const result = /<([a-zA-Z][a-zA-Z0-9:\-_.]*)(?:\s+[^<>]*?[^\s/<>=]+?)*?\s?(\/|>)$/.exec(text);
        if (
            result !== null &&
            (occurrenceCount(result[0], "'") % 2 === 0 &&
                occurrenceCount(result[0], '"') % 2 === 0 &&
                occurrenceCount(result[0], "`") % 2 === 0)
        ) {
            if (result[2] === ">") {
                if (excludedTags.indexOf(result[1].toLowerCase()) === -1) {
                    activeTextEditor
                        .edit(editBuilder => {
                            editBuilder.insert(originalPosition, `</${result[1]}>`);
                        })
                        .then(() => {
                            activeTextEditor.selection = new Selection(originalPosition, originalPosition);
                        });
                }
            } else {
                if (
                    textLine.text.length <= selection.start.character + 1 ||
                    textLine.text[selection.start.character + 1] !== ">"
                ) {
                    // if not typing "/" just before ">", add the ">" after "/"
                    activeTextEditor.edit(editBuilder => {
                        editBuilder.insert(originalPosition, ">");
                    });
                }
            }
        }
    }
}

function checkRightAngleBracket(contentChange: TextDocumentContentChangeEvent): boolean {
    return contentChange.text === ">" || checkRightAngleBracketInVSCode_1_8(contentChange);
}

function checkRightAngleBracketInVSCode_1_8(contentChange: TextDocumentContentChangeEvent): boolean {
    return (
        contentChange.text.endsWith(">") &&
        contentChange.range.start.character === 0 &&
        contentChange.range.start.line === contentChange.range.end.line &&
        !contentChange.range.end.isEqual(new Position(0, 0))
    );
}

export function insertCloseTag(activeTextEditor: undefined | TextEditor): void {
    if (!activeTextEditor) {
        return;
    }

    const selection = activeTextEditor.selection;
    const originalPosition = selection.start;
    const excludedTags: string[] = [];
    const text = activeTextEditor.document.getText(new Range(new Position(0, 0), originalPosition));
    if (text.length > 2) {
        const closeTag = getCloseTag(text, excludedTags);
        if (closeTag) {
            activeTextEditor.edit(editBuilder => {
                editBuilder.insert(originalPosition, closeTag);
            });
        }
    }
}

function getNextChar(editor: TextEditor, position: Position): string {
    const nextPosition = position.translate(0, 1);
    const text = editor.document.getText(new Range(position, nextPosition));
    return text;
}

function getCloseTag(text: string, excludedTags: string[]): undefined | string {
    const regex = /<(\/?[a-zA-Z][a-zA-Z0-9:\-_.]*)(?:\s+[^<>]*?[^\s/<>=]+?)*?\s?>/g;
    let result;
    const stack = [];
    // tslint:disable-next-line:no-conditional-assignment
    while ((result = regex.exec(text)) !== null) {
        const isStartTag = result[1].substr(0, 1) !== "/";
        const tag = isStartTag ? result[1] : result[1].substr(1);
        if (excludedTags.indexOf(tag.toLowerCase()) === -1) {
            if (isStartTag) {
                stack.push(tag);
            } else if (stack.length > 0) {
                const lastTag = stack[stack.length - 1];
                if (lastTag === tag) {
                    stack.pop();
                }
            }
        }
    }
    if (stack.length > 0) {
        const closeTag = stack[stack.length - 1];
        if (text.substr(text.length - 2) === "</") {
            return closeTag + ">";
        }
        if (text.substr(text.length - 1) === "<") {
            return `/${closeTag}>`;
        }
        return `</${closeTag}>`;
    } else {
        return undefined;
    }
}

function moveSelectionRight(selection: Selection, shift: number): Selection {
    const newPosition = selection.active.translate(0, shift);
    const newSelection = new Selection(newPosition, newPosition);
    return newSelection;
}

function occurrenceCount(source: string, find: string): number {
    return source.split(find).length - 1;
}
