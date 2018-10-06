import { suite, test } from "mocha-typescript";
import { CompletionItem } from "vscode-languageserver-types";

import { CompletionItemDescriptionResolver } from "../../server/src/CompletionItemDescriptionResolver";
import { DataSchemaNode } from "../../server/src/DataSchema/DataSchemaNode";
import { CompletionSuggester } from "../../server/src/Suggester/CompletionSuggester";
import { AttributeType, AvailableChildrenType } from "../../server/src/Suggester/SugarElementInfo";

import { expect } from "./Utils/Expect";

@suite
export class CompletionItemDescriptionResolverTest {
    @test
    public "Непустой аттрибут path у первого открывающегося тэга. Описание элемента"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 path="Root"><ctag3 path="');
        const descriptionResolver = new CompletionItemDescriptionResolver(this.createTestDataSchema());

        const completionItem: CompletionItem = { label: "Child1" };
        descriptionResolver.enrichCompletionItem(completionItem, suggestions.items[0]);

        expect(completionItem).to.shallowDeepEqual({
            detail: "{ ... }",
            documentation: {
                kind: "markdown",
                value: "Children1 Description",
            },
        });
    }

    @test
    public "Непустой аттрибут path у первого открывающегося тэга. Описание атрибута"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 path="Root"><ctag3 path="');
        const descriptionResolver = new CompletionItemDescriptionResolver(this.createTestDataSchema());

        const completionItem: CompletionItem = { label: "attr1" };
        descriptionResolver.enrichCompletionItem(completionItem, suggestions.items[2]);

        expect(completionItem).to.shallowDeepEqual({
            detail: "<>",
            documentation: {
                kind: "markdown",
                value: "attr1 Description",
            },
        });
    }

    @test
    public "Пустой аттрибут path у первого открывающегося тэга"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 path="');
        const descriptionResolver = new CompletionItemDescriptionResolver(this.createTestDataSchema());

        const completionItem: CompletionItem = { label: "Root" };
        descriptionResolver.enrichCompletionItem(completionItem, suggestions.items[0]);

        expect(completionItem).to.shallowDeepEqual({
            detail: "{ ... }",
            documentation: {
                kind: "markdown",
                value: "Root Description",
            },
        });
    }

    private createTestCompletionSuggester(): CompletionSuggester {
        const dataSchema = this.createTestDataSchema();
        return new CompletionSuggester(
            [
                {
                    name: "a-type1",
                },
                {
                    name: "b-type2",
                },
            ],
            [
                {
                    name: "atag1",
                    createPathScope: true,
                    attributes: [
                        {
                            name: "path",
                            valueTypes: [AttributeType.Path],
                        },
                    ],
                    availableChildren: {
                        type: AvailableChildrenType.Any,
                    },
                },
                {
                    name: "btag2",
                    createPathScope: false,
                    attributes: [
                        {
                            name: "type",
                            valueTypes: [AttributeType.Type],
                        },
                    ],
                    availableChildren: {
                        type: AvailableChildrenType.List,
                        list: ["tag3"],
                    },
                },
                {
                    name: "ctag3",
                    createPathScope: true,
                    attributes: [
                        {
                            name: "path",
                            valueTypes: [AttributeType.Path],
                        },
                    ],
                    availableChildren: {
                        type: AvailableChildrenType.Any,
                    },
                },
            ],
            dataSchema
        );
    }

    private createTestDataSchema(): DataSchemaNode {
        const fakePosition = {
            start: { column: 0, line: 0, offset: 0 },
            end: { column: 0, line: 0, offset: 0 },
        };

        return {
            name: "",
            position: fakePosition,
            children: [
                {
                    name: "Root",
                    description: "Root Description",
                    position: fakePosition,
                    attributes: [
                        {
                            name: "attr1",
                            description: "attr1 Description",
                        },
                        {
                            name: "attr2",
                        },
                    ],
                    children: [
                        {
                            name: "Children1",
                            position: fakePosition,
                            description: "Children1 Description",
                            children: [
                                {
                                    name: "Child1",
                                    position: fakePosition,
                                    multiple: true,
                                    attributes: [
                                        {
                                            name: "ChildAttr1",
                                        },
                                        {
                                            name: "ChildAttr2",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            name: "Child2",
                            position: fakePosition,
                        },
                    ],
                },
            ],
        };
    }
}
