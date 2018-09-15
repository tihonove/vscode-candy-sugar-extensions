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
            `<tag a="1">`,
            `<tag a="1" a>`,
            `<tag a="1" a=>`,
            `<tag a="1" a= b=>`,
            `<tag a="1" a= b=>asdsadsa</a>`,
            `<tag a="1" a= b=><a></a>`,
        ];
        for (const validCode of validCodes) {
            const parser = createParser();
            parser.feed(validCode);
            parser.finish();
            expect(parser.results != null).to.eql(true);
            // console.log(parser.results[0]);
        }
    }

    // @test
    // public testSelfClosingRoot(): void {
    //     this.assertAst("<AA />", [
    //         {
    //             position: {
    //                 start: 0,
    //                 end: 5,
    //             },
    //             tagName: "AA",
    //             type: "Node",
    //             children: [],
    //         },
    //     ]);
    //
    //     this.assertAst("<AA/>", [
    //         {
    //             position: {
    //                 start: 0,
    //                 end: 4,
    //             },
    //             tagName: "AA",
    //             type: "Node",
    //             children: [],
    //         },
    //     ]);
    // }
    //
    // @test
    // public testSelfClosingRoot(): void {
    //     this.assertAst("<AA></AA>", [
    //         {
    //             position: {
    //                 start: 0,
    //                 end: 5,
    //             },
    //             tagName: "AA",
    //             type: "Node",
    //             children: [],
    //         },
    //     ]);
    // }

    private assertAst(input: string, expectedAst: any): void {
        const parser = createParser();
        parser.feed(input);
        parser.finish();
        expect(parser.results).to.eql(expectedAst);
    }
}
