import { suite, test } from "mocha-typescript";

import { SchemaRngParser } from "../server/src/SchemaParser/SchemaRngParser";

import { expect } from "./Expect";

const xmlPreamble = `<?xml version="1.0" encoding="utf-8"?>`;

@suite
export class SchemaRngParserTest {
    @test
    public testSingleRoot(): void {
        const parser = new SchemaRngParser();
        const node = parser.toDataSchema(xmlPreamble + `<element name="Файл" description="Файл обмена"></element>`);
        expect(node).to.shallowDeepEqual({
            name: "",
            children: [
                {
                    name: "Файл",
                },
            ],
        });
    }

    @test
    public testChildAttribute(): void {
        const parser = new SchemaRngParser();
        const node = parser.toDataSchema(
            xmlPreamble +
                `
<element name="Root">
  <attribute name="ИдФайл">
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
                        },
                    ],
                },
            ],
        });
    }

    @test
    public testChoiceElements(): void {
        const parser = new SchemaRngParser();
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
}
