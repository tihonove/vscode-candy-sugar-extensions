export function getCloseTag(text: string, excludedTags: string[]): undefined | string {
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
