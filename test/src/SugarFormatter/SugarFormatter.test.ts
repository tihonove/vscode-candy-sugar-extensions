import { suite, test } from "mocha-typescript";

import { expect } from "../Utils/Expect";

import { SugarFormatter } from "../../../server/src/SugarFormatter/SugarFormatter";

@suite
export class SugarFormatterTest {
    @test
    public testEmptyTag(): void {
        this.checkFormat(`<page></page>`, `<page />\n`);
    }

    @test
    public testEmptyTagAttributes(): void {
        this.checkFormat(`<page a="1"></page>`, `<page a="1" />\n`);
        this.checkFormat(
            `<page a="1234567890"></page>`,
            `<page
    a="1234567890"
/>\n`,
            10
        );
    }

    @test
    public testComments(): void {
        this.checkFormat(`<a><!-- a --></a>`, `<a><!-- a --></a>\n`);
        this.checkFormat(
            `<a><!--a1--><b /><!--a2--><b /><!--a3--><b /></a>`,
            `<a>
    <!-- a1 -->
    <b />
    <!-- a2 -->
    <b />
    <!-- a3 -->
    <b />
</a>\n`
        );
        this.checkFormat(
            `<a><!--a1--><b /><!--a2--><b /><!--a3--></a>`,
            `<a>
    <!-- a1 -->
    <b />
    <!-- a2 -->
    <b />
    <!-- a3 -->
</a>\n`
        );
        this.checkFormat(
            `<a><!-- 1234567890 --></a>`,
            `<a>
    <!-- 1234567890 -->
</a>\n`,
            25
        );

        this.checkFormat(
            `<a><!-- 12345678901234567890 --></a>`,
            `<a>
    <!--
        12345678901234567890
    -->
</a>\n`,
            25
        );

        this.checkFormat(
            `<a><!-- 1234567890
                1234567890 --></a>`,
            `<a>
    <!--
        1234567890
        1234567890
    -->
</a>\n`,
            15
        );

        this.checkFormat(
            `<a><!-- 1234567890
1234567890 --></a>`,
            `<a>
    <!--
        1234567890
        1234567890
    -->
</a>\n`,
            15
        );

        this.checkFormat(
            `<a><!-- 1234567890

1234567890 --></a>`,
            `<a>
    <!--
        1234567890

        1234567890
    -->
</a>\n`,
            15
        );

        this.checkFormat(
            `<a><!-- a --><b /></a>`,
            `<a>
    <!-- a -->
    <b />
</a>\n`
        );

        this.checkFormat(
            `<a><!-- 1234567890 --><b /></a>`,
            `<a>
    <!-- 1234567890 -->
    <b />
</a>\n`,
            25
        );

        this.checkFormat(
            `<a><!-- 12345678901234567890 --><b /></a>`,
            `<a>
    <!--
        12345678901234567890
    -->
    <b />
</a>\n`,
            25
        );
    }

    @test
    public testChildTextWithAttributes(): void {
        this.checkFormat(`<page a="1">text</page>`, `<page a="1">text</page>\n`);
        this.checkFormat(
            `<page a="1234567890">text</page>`,
            `<page
    a="1234567890">
    text
</page>\n`,
            10
        );
        this.checkFormat(
            `<page a="1">12345678901234567890</page>`,
            `<page a="1">
    12345678901234567890
</page>\n`,
            20
        );
    }

    @test
    public testChildTag(): void {
        this.checkFormat(
            `<a><b></b></a>`,
            `<a>
    <b />
</a>\n`
        );
        this.checkFormat(
            `<a>
    <b>test1</b>
    <c>test2</c>
</a>`,
            `<a>
    <b>test1</b>
    <c>test2</c>
</a>\n`
        );
    }

    @test
    public testAttributes(): void {
        this.checkFormat(
            `<a a="1"><b></b></a>`,
            `<a a="1">
    <b />
</a>\n`
        );
        this.checkFormat(
            `<a a="1234567890"><b></b></a>`,
            `<a a="1234567890">
    <b />
</a>\n`,
            10
        );
        this.checkFormat(
            `<averlogntag a="1234567890"><b></b></averlogntag>`,
            `<averlogntag
    a="1234567890">
    <b />
</averlogntag>\n`,
            10
        );
        this.checkFormat(
            `<a a="12345" b="12345"><b></b></a>`,
            `<a
    a="12345"
    b="12345">
    <b />
</a>\n`,
            10
        );
    }

    @test
    public testSingleText(): void {
        this.checkFormat(`<page>text</page>`, `<page>text</page>\n`);
        this.checkFormat(
            `<page>text
</page>`,
            `<page>text</page>\n`
        );
        this.checkFormat(
            `<a>1234567890</a>`,
            `<a>
    1234567890
</a>
`,
            14
        );
        this.checkFormat(
            `<a>1234567890 0987654321</a>`,
            `<a>
    1234567890
    0987654321
</a>
`,
            14
        );
        this.checkFormat(
            `<a>
    1234567890
    0987654321
</a>
`,
            `<a>
    1234567890
    0987654321
</a>
`,
            14
        );
        this.checkFormat(
            `<a>
    1234567890098765432109876543210987654321
    0987654321
</a>
`,
            `<a>
    1234567890098765432109876543210987654321
    0987654321
</a>
`,
            14
        );
        this.checkFormat(
            `<a>
    1234567890098765432109876543210987654321
    0987654321    
</a>
`,
            `<a>
    1234567890098765432109876543210987654321
    0987654321
</a>
`,
            14
        );
        this.checkFormat(
            `<a>
    1234567890098765432109876543210987654321
    0
</a>
`,
            `<a>
    1234567890098765432109876543210987654321
    0
</a>
`,
            14
        );
    }

    @test
    public testJavascriptSimpleAttributesFormat(): void {
        this.checkFormat(`<tag4 x={"str"}></tag4>`, `<tag4 x={"str"} />\n`);
        this.checkFormat(
            `<tag4 x={"1234567890"}></tag4>`,
            `<tag4
    x={"1234567890"}
/>\n`,
            10
        );
        this.checkFormat(`<tag4 x={true}></tag4>`, `<tag4 x={true} />\n`);
        this.checkFormat(
            `<tag1234567890 x={true}></tag1234567890>`,
            `<tag1234567890
    x={true}
/>\n`,
            10
        );
        this.checkFormat(`<tag4 x={1}></tag4>`, `<tag4 x={1} />\n`);
        this.checkFormat(
            `<tag1234567890 x={1}></tag1234567890>`,
            `<tag1234567890
    x={1}
/>\n`,
            10
        );
        this.checkFormat(
            `<tag4 x={1234567890}></tag4>`,
            `<tag4
    x={1234567890}
/>\n`,
            10
        );
    }

    @test
    public testJavascriptArrayAttributesFormat(): void {
        this.checkFormat(`<tag4 x={[1]}></tag4>`, `<tag4 x={[1]} />\n`, 20);
        this.checkFormat(
            `<tag4 x={[1, 2, 3, 4, 5, 6, 7, 8, 9, 0]}></tag4>`,
            `<tag4
    x={[
        1,
        2,
        3,
        4,
        5,
        6,
        7,
        8,
        9,
        0
    ]}
/>\n`,
            30
        );
        this.checkFormat(
            `<tag4 x={[1, 2, 3, 4, 5, 6, 7, 8, 9, 0]}></tag4>`,
            `<tag4
    x={[1, 2, 3, 4, 5, 6, 7, 8, 9, 0]}
/>\n`,
            40
        );
    }

    @test
    public testJavascriptObjectLiteralAttributesFormat(): void {
        this.checkFormat(`<tag4 x={{ }}></tag4>`, `<tag4 x={{}} />\n`, 100);
        this.checkFormat(`<tag4 x={{ a: 1 }}></tag4>`, `<tag4 x={{ a: 1 }} />\n`, 100);
        this.checkFormat(`<tag4 x={{ "a": 1 }}></tag4>`, `<tag4 x={{ "a": 1 }} />\n`, 100);
        this.checkFormat(
            `<tag4 x={{ a: "123456789012345678" }}></tag4>`,
            `<tag4 x={{ a: "123456789012345678" }} />\n`,
            40
        );
        this.checkFormat(
            `<tag4 x={{ a: "1234567890123456789" }}></tag4>`,
            `<tag4
    x={{ a: "1234567890123456789" }}
/>\n`,
            40
        );
        this.checkFormat(
            `<tag4 x={{ a: "1234567890123456789" }}></tag4>`,
            `<tag4
    x={{ a: "1234567890123456789" }}
/>\n`,
            40
        );
        this.checkFormat(
            `<tag4 x={{ a12345: "1234567890123456789012345" }}></tag4>`,
            `<tag4
    x={{
        a12345:
            "1234567890123456789012345",
    }}
/>\n`,
            40
        );
        this.checkFormat(
            `<tag4 x={{ a1: "1234567890", a2: "123456789012345" }}></tag4>`,
            `<tag4
    x={{
        a1: "1234567890",
        a2: "123456789012345",
    }}
/>\n`,
            40
        );
        this.checkFormat(
            `<tag4 x={{ a1: "1234567890", a2: "123456789012345" }}></tag4>`,
            `<tag4
    x={{
        a1: "1234567890",
        a2: "123456789012345",
    }}
/>\n`,
            40
        );
    }

    @test
    public testJavascriptStringAttributesFormat(): void {
        this.checkFormat(`<tag4 x={"str"}></tag4>`, `<tag4 x={"str"} />\n`);
    }

    private checkFormat(input: string, expected: string, maxLength: number = 100): void {
        const formatter = new SugarFormatter({ tabs: 4, maxLength: maxLength });
        expect(formatter.format(input)).to.eql(expected);
    }
}
