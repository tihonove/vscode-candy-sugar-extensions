import { expect } from "chai";
import { suite, test } from "mocha-typescript";

import { createParser } from "./XmlParser/Parser";

@suite
export class XmlParserTest {
    @test
    public testValidAst(): void {
        const validCodes = [
            "<tag>",
            "<tag />",
            "<tag />",
            "<tag>asdsad</tag>",
            "<tag><a><b>asdsad",
            // `<tag a="1">`,
            // `<tag a="1" a>`,
            // `<tag a="1" a=>`,
            // `<tag a="1" a= b=>`,
            // `<tag a="1" a= b=>asdsadsa</a>`,
            // `<tag a="1" a= b=><a></a>`,
        ];
        for (const validCode of validCodes) {
            const parser = createParser();
            parser.feed(validCode);
            parser.finish();
            expect(parser.results != null).to.eql(true);
            console.log(JSON.stringify(parser.results[0], undefined, "  "));
        }
    }

    @test
    public testValidAst01(): void {
        this.assertFullAst("<tag>text</tag>", [
            {
                body: "<tag>",
                position: { start: 0, end: 4 },
                type: "tag",
            },
            {
                body: "text",
                position: { start: 5, end: 8 },
                type: "text",
            },
            {
                body: "</tag>",
                type: "closingTag",
                position: { start: 9, end: 14 },
            },
        ]);
    }

    @test
    public testValidAst02(): void {
        this.assertFullAst("<tag><a><b>asdsad", [
            {
                body: "<tag>",
                position: { start: 0, end: 4 },
                type: "tag",
            },
            {
                body: "<a>",
                position: { start: 5, end: 7 },
                type: "tag",
            },
            {
                body: "<b>",
                position: { start: 8, end: 10 },
                type: "tag",
            },
            {
                body: "asdsad",
                position: { start: 11, end: 16 },
                type: "text",
            },
        ]);
    }

    @test
    public testValidAst03(): void {
        this.assertAstBodies("<tag>", ["<tag>"]);
        this.assertAstBodies("<tag />", ["<tag />"]);
        this.assertAstBodies("<tag></tag>", ["<tag>", "</tag>"]);
        this.assertAstBodies("<tag><a></tag>", ["<tag>", "<a>", "</tag>"]);
    }

    @test
    public testAstForAttributes01(): void {
        this.assertFullAst(`<tag a="1">`, [
            {
                body: `<tag a="1">`,
                position: { start: 0, end: 10 },
                attributes: [
                    {
                        body: 'a="1"',
                        position: { start: 5, end: 9 },
                        type: "attribute",
                    },
                ],
                type: "tag",
            },
        ]);
    }

    @test
    public testAstForAttributes02(): void {
        this.assertFullAst(`<tag a="1" b="2">`, [
            {
                body: `<tag a="1">`,
                position: { start: 0, end: 16 },
                attributes: [
                    {
                        body: 'a="1"',
                        position: { start: 5, end: 9 },
                        type: "attribute",
                    },
                    {
                        body: 'b="2"',
                        position: { start: 11, end: 15 },
                        type: "attribute",
                    },
                ],
                type: "tag",
            },
        ]);
    }

    private assertFullAst(input: string, expectedAst: any): void {
        const parser = createParser();
        parser.feed(input);
        parser.finish();
        expect(parser.results[0]).to.eql(expectedAst);
    }

    private assertAstBodies(input: string, expectedAst: string[]): void {
        const parser = createParser();
        parser.feed(input);
        parser.finish();
        expect(parser.results[0].map(x => x.body)).to.eql(expectedAst);
    }
}
