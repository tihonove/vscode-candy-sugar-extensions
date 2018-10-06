import { suite, test } from "mocha-typescript";

import { CompletionSuggester, SuggestionItemType } from "../../server/src/Suggester/CompletionSuggester";
import { AttributeType, AvailableChildrenType } from "../../server/src/Suggester/SugarElementInfo";

import { expect } from "./Expect";

@suite
export class CompletionSuggesterTest {
    @test
    public "Пустой первый открывающйся тэг"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest("<");
        expect(suggestions).to.shallowDeepEqual({
            items: [
                {
                    type: SuggestionItemType.Element,
                    name: "atag1",
                },
                {
                    type: SuggestionItemType.Element,
                    name: "btag2",
                },
                {
                    type: SuggestionItemType.Element,
                    name: "ctag3",
                },
            ],
        });
    }

    @test
    public "Непустой первый открывающйся тэг с префиксом"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest("<a");
        expect(suggestions).to.shallowDeepEqual({
            items: [
                {
                    type: SuggestionItemType.Element,
                    name: "atag1",
                },
                {
                    type: SuggestionItemType.Element,
                    name: "btag2",
                },
                {
                    type: SuggestionItemType.Element,
                    name: "ctag3",
                },
            ],
        });
    }

    @test
    public "Аттрибуты у первого открывающегося тэга"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest("<atag1 ");
        expect(suggestions).to.shallowDeepEqual({
            items: [
                {
                    type: SuggestionItemType.Attribute,
                    name: "path",
                },
            ],
        });
    }

    @test
    public "Пустой аттрибут path у первого открывающегося тэга"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 path="');
        expect(suggestions).to.shallowDeepEqual({
            items: [
                {
                    type: SuggestionItemType.DataElement,
                    name: "Root",
                },
            ],
        });
    }

    @test
    public "Непустой аттрибут path у первого открывающегося тэга"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 path="Root/');
        expect(suggestions).to.shallowDeepEqual({
            items: [
                {
                    type: SuggestionItemType.DataElement,
                    name: "Children1",
                },
                {
                    type: SuggestionItemType.DataElement,
                    name: "Child2",
                },
                {
                    type: SuggestionItemType.DataAttribute,
                    name: "attr1",
                },
                {
                    type: SuggestionItemType.DataAttribute,
                    name: "attr2",
                },
            ],
        });
    }

    @test
    public "Непустой аттрибут path у первого открывающегося тэга. Проверка полного пути"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 path="Root/');
        expect(suggestions).to.shallowDeepEqual({
            items: [
                {
                    type: SuggestionItemType.DataElement,
                    name: "Children1",
                    fullPath: ["Root", "Children1"],
                },
                {
                    type: SuggestionItemType.DataElement,
                    name: "Child2",
                    fullPath: ["Root", "Child2"],
                },
                {
                    type: SuggestionItemType.DataAttribute,
                    name: "attr1",
                    fullPath: ["Root", "attr1"],
                },
                {
                    type: SuggestionItemType.DataAttribute,
                    name: "attr2",
                    fullPath: ["Root", "attr2"],
                },
            ],
        });
    }

    @test
    public "Непустой аттрибут path у первого открывающегося тэга. Полный путь до элемента"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 path="Root"><ctag3 path="');
        expect(suggestions).to.shallowDeepEqual({
            items: [
                {
                    type: SuggestionItemType.DataElement,
                    name: "Children1",
                    fullPath: ["Root", "Children1"],
                },
                {
                    type: SuggestionItemType.DataElement,
                    name: "Child2",
                    fullPath: ["Root", "Child2"],
                },
                {
                    type: SuggestionItemType.DataAttribute,
                    name: "attr1",
                    fullPath: ["Root", "attr1"],
                },
                {
                    type: SuggestionItemType.DataAttribute,
                    name: "attr2",
                    fullPath: ["Root", "attr2"],
                },
            ],
        });
    }

    @test
    public "Непустой аттрибут path у тэга с суженным мутём к данным"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 path="Root"><ctag3 path="');
        expect(suggestions).to.shallowDeepEqual({
            items: [
                {
                    type: SuggestionItemType.DataElement,
                    name: "Children1",
                },
                {
                    type: SuggestionItemType.DataElement,
                    name: "Child2",
                },
                {
                    type: SuggestionItemType.DataAttribute,
                    name: "attr1",
                },
                {
                    type: SuggestionItemType.DataAttribute,
                    name: "attr2",
                },
            ],
        });
    }

    private createTestCompletionSuggester(): CompletionSuggester {
        const fakePosition = {
            start: { column: 0, line: 0, offset: 0 },
            end: { column: 0, line: 0, offset: 0 },
        };
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
            {
                name: "",
                position: fakePosition,
                children: [
                    {
                        name: "Root",
                        position: fakePosition,
                        attributes: [
                            {
                                name: "attr1",
                            },
                            {
                                name: "attr2",
                            },
                        ],
                        children: [
                            {
                                name: "Children1",
                                position: fakePosition,
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
            }
        );
    }
}