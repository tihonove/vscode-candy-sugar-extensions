import { expect } from "chai";
import { suite, test } from "mocha-typescript";

import { createParser } from "../XmlParser/Parser";

class CompletionSuggester {}

@suite
class CursorLocationContextTest {
    // public test01(): void {
    //     const suggester = new CompletionSuggester();
    //     checkSuggestions(suggester, "<tag /><{|}");
    //     checkSuggestions(suggester, "<tag><{|}");
    //     checkSuggestions(suggester, "<input {|} />");
    //     checkSuggestions(suggester, "<{|} />");
    //     checkSuggestions(suggester, "<in{|} />");
    //     checkSuggestions(suggester, "<i{|}n />");
    //     checkSuggestions(suggester, "<i{|}n />");
    //     checkSuggestions(suggester, "<i{|}n />");
    //     checkSuggestions(suggester, "<input value='{|}' />");
    //     checkSuggestions(suggester, "<input value='Root/{|}' />");
    //     checkSuggestions(suggester, "<input value='Root/Va{|}' />");
    //     checkSuggestions(suggester, "<input type='{|}' />");
    // }

    @test
    public test01(): void {
        this.checkLocationContext("<tag{|} />", CompletionContextType.Tag, "<tag />");
        this.checkLocationContext("<tag {|}/>", CompletionContextType.Attribute, "<tag />");
        this.checkLocationContext("<tag xx{|}/>", CompletionContextType.Attribute, "<tag />");
        // this.checkLocationContext("<tag xx={|}/>", CompletionContextType.AttributeValue, "<tag />");

        // checkSuggestions(suggester, "<tag><{|}");
        // checkSuggestions(suggester, "<input {|} />");
        // checkSuggestions(suggester, "<{|} />");
        // checkSuggestions(suggester, "<in{|} />");
        // checkSuggestions(suggester, "<i{|}n />");
        // checkSuggestions(suggester, "<i{|}n />");
        // checkSuggestions(suggester, "<i{|}n />");
        // checkSuggestions(suggester, "<input value='{|}' />");
        // checkSuggestions(suggester, "<input value='Root/{|}' />");
        // checkSuggestions(suggester, "<input value='Root/Va{|}' />");
        // checkSuggestions(suggester, "<input type='{|}' />");
    }

    public checkLocationContext(inputWithCaret: string, type: CompletionContextType, a: any) {
        const caretLocation = inputWithCaret.indexOf("{|}");
        const input = inputWithCaret.replace("{|}", "");
        const parser = createParser();
        parser.feed(input);
        parser.finish();
        const completionContext = getCompletionContext(parser.results[0], caretLocation);
        expect(completionContext != undefined).to.eql(true);
        if (completionContext != undefined) {
            expect(completionContext.type).to.eql(type);
        }
    }
}

interface ParseResultPosition {
    start: number;
    end: number;
}

interface ParseResultItem {
    type: "tag";
    position: ParseResultPosition;
    body: string;
}

enum CompletionContextType {
    Tag = "Tag",
    Attribute = "Attribute",
    AttributeValue = "AttributeValue",
}

interface CompletionContext {
    context: ParseResultItem;
    type: CompletionContextType;
}

function getCompletionContext(parseItems: ParseResultItem[], caretLocation: number): undefined | CompletionContext {
    let parseItemUnderCaret: undefined | ParseResultItem;
    for (const parseItem of parseItems) {
        if (parseItem.position.start <= caretLocation && caretLocation <= parseItem.position.end) {
            parseItemUnderCaret = parseItem;
        }
    }
    if (parseItemUnderCaret == undefined) {
        return undefined;
    }
    if (parseItemUnderCaret.type === "tag" || parseItemUnderCaret.type === "selfClosingTag") {
        const attributeUnderCaret =
        const relativePosition = caretLocation - parseItemUnderCaret.position.start;
        if (isSpaceChar(parseItemUnderCaret.body[relativePosition - 1])) {
            return {
                context: parseItemUnderCaret,
                type: CompletionContextType.Attribute,
            };
        }
        return {
            context: parseItemUnderCaret,
            type: CompletionContextType.Tag,
        };
    }
    return undefined;
}

function isSpaceChar(char: string) {
    return /^\s$/.test(char);
}
