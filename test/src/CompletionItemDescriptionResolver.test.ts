import { suite, test } from "mocha-typescript";
import { CompletionItem } from "vscode-languageserver-types";

import { DataSchemaElementNode } from "../../server/src/DataSchema/DataSchemaNode";
import { CompletionItemDescriptionResolver } from "../../server/src/LanguageServer/CompletionItemDescriptionResolver";
import { CompletionSuggester } from "../../server/src/SugarAnalyzing/CompletionSuggester";
import { AttributeType, AvailableChildrenType } from "../../server/src/SugarElements/SugarElementInfo";

import { expect } from "./Utils/Expect";
import { testSugarTypes } from "./Utils/TestInfos";

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
            detail: '<element name="Children1">',
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
            detail: '<attribute name="attr1">',
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
            detail: '<element name="Root">',
            documentation: {
                kind: "markdown",
                value: "Root Description",
            },
        });
    }

    private createTestCompletionSuggester(): CompletionSuggester {
        const dataSchema = this.createTestDataSchema();
        return new CompletionSuggester(
            testSugarTypes,
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

    private createTestDataSchema(): DataSchemaElementNode {
        const fakePosition = {
            start: { column: 0, line: 0, offset: 0 },
            end: { column: 0, line: 0, offset: 0 },
        };

        return {
            name: "",
            type: "DataSchemaElementNode",
            position: fakePosition,
            children: [
                {
                    type: "DataSchemaElementNode",
                    name: "Root",
                    description: "Root Description",
                    position: fakePosition,
                    attributes: [
                        {
                            type: "DataSchemaAttribute",
                            position: fakePosition,
                            name: "attr1",
                            description: "attr1 Description",
                        },
                        {
                            type: "DataSchemaAttribute",
                            position: fakePosition,
                            name: "attr2",
                        },
                    ],
                    children: [
                        {
                            type: "DataSchemaElementNode",
                            name: "Children1",
                            position: fakePosition,
                            description: "Children1 Description",
                            children: [
                                {
                                    type: "DataSchemaElementNode",
                                    name: "Child1",
                                    position: fakePosition,
                                    multiple: true,
                                    attributes: [
                                        {
                                            type: "DataSchemaAttribute",
                                            position: fakePosition,
                                            name: "ChildAttr1",
                                        },
                                        {
                                            type: "DataSchemaAttribute",
                                            position: fakePosition,
                                            name: "ChildAttr2",
                                        },
                                    ],
                                },
                            ],
                        },
                        {
                            type: "DataSchemaElementNode",
                            name: "Child2",
                            position: fakePosition,
                        },
                    ],
                },
            ],
        };
    }
}
