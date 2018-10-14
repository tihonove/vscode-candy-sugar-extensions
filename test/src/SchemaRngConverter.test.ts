import fs from "fs";
import { suite, test } from "mocha-typescript";

import { SchemaRngConverter } from "../../server/src/DataSchema/DataSchemaParser/SchemaRngConverter";

import { expect } from "./Utils/Expect";

const xmlPreamble = `<?xml version="1.0" encoding="utf-8"?>`;

@suite
export class SchemaRngConverterTest {
    @test
    public testSingleRoot(): void {
        const parser = new SchemaRngConverter();
        const node = parser.toDataSchema(
            xmlPreamble + `<element name="Файл" type="string" description="Файл обмена"></element>`
        );
        expect(node).to.shallowDeepEqual({
            name: "",
            children: [
                {
                    name: "Файл",
                    description: "Файл обмена",
                },
            ],
        });
    }

    @test
    public testChildAttribute(): void {
        const parser = new SchemaRngConverter();
        const node = parser.toDataSchema(
            xmlPreamble +
                `
<element name="Root">
  <attribute name="ИдФайл" description="ИдФайл description">
    <type base="string">
      <minLength value="1" />
      <maxLength value="255" />
    </type>
  </attribute>
</element>`
        );
        expect(node).to.shallowDeepEqual({
            name: "",
            children: [
                {
                    name: "Root",
                    attributes: [
                        {
                            name: "ИдФайл",
                            description: "ИдФайл description",
                        },
                    ],
                },
            ],
        });
    }

    @test
    public testChoiceElements(): void {
        const parser = new SchemaRngConverter();
        const node = parser.toDataSchema(
            xmlPreamble +
                `
<element name="Root">
    <choice>
        <element name="Choice1"></element>
        <element name="Choice2"></element>
    </choice>
</element>
`
        );
        expect(node).to.shallowDeepEqual({
            name: "",
            children: [
                {
                    name: "Root",
                    children: [
                        {
                            name: "Choice1",
                        },
                        {
                            name: "Choice2",
                        },
                    ],
                },
            ],
        });
    }

    @test
    public testSelfClosingTag(): void {
        const parser = new SchemaRngConverter();
        const node = parser.toDataSchema(
            xmlPreamble +
                `
<element name="Root">
    <element name="Choice1" />
    <element name="Choice2"/>
</element>
`
        );
        expect(node).to.shallowDeepEqual({
            name: "",
            children: [
                {
                    name: "Root",
                    children: [
                        {
                            name: "Choice1",
                        },
                        {
                            name: "Choice2",
                        },
                    ],
                },
            ],
        });
    }

    @test
    public testPositionOfElement(): void {
        const parser = new SchemaRngConverter();
        const node = parser.toDataSchema(
            xmlPreamble +
                `
<element name="Root">
    <element name="Choice1" />
    <element name="Choice2"/>
</element>
`
        );
        expect(node).to.shallowDeepEqual({
            name: "",
            children: [
                {
                    name: "Root",
                    position: {
                        end: {
                            column: 11,
                            line: 5,
                            offset: 132,
                        },
                        start: {
                            column: 1,
                            line: 2,
                            offset: 39,
                        },
                    },
                },
            ],
        });
    }

    @test
    public testNonMeaningfulCases(): void {
        const parser = new SchemaRngConverter();
        parser.toDataSchema(
            xmlPreamble +
                `
<!-- comment -->

<element name="Root">
    <!-- comment -->
    <element name="Choice1" />
    <element name="Choice2"/>
</element>

<!-- comment -->

`
        );
    }

    @test
    public testNamesWithDashes(): void {
        const parser = new SchemaRngConverter();
        parser.toDataSchema(
            xmlPreamble +
                `
<element name="Root">
    <element name="Choice1" />
    <element name="Choice2"/>
    <a-a b-b="a" />
</element>`
        );
    }

    @test
    public testRealSchemaSkipBom(): void {
        const parser = new SchemaRngConverter();
        parser.toDataSchema(fs.readFileSync(require.resolve("./RealData/Schema02.xml"), "utf8"));
    }

    @test
    public testRealSchema(): void {
        const parser = new SchemaRngConverter();
        parser.toDataSchema(fs.readFileSync(require.resolve("./RealData/Schema01.xml"), "utf8"));
    }
}
