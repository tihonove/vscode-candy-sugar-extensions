import { suite, test } from "mocha-typescript";

import { CompletionSuggester } from "../../server/src/SugarAnalyzing/ComletionSuggesting/CompletionSuggester";
import { SuggestionItem, SuggestionItemType } from "../../server/src/SugarAnalyzing/ComletionSuggesting/SuggestionItem";
import { TypeKind } from "../../server/src/SugarElements/UserDefinedSugarTypeInfo";

import { expect } from "./Utils/Expect";
import {
    testDataSchema,
    testSugarElementInfos,
    testSugarTypes,
    testTemplatesSugarElementInfos,
} from "./Utils/TestInfos";

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
    public "Аттрибут типа enum"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 enum-attr="');
        expect(suggestions).to.shallowDeepEqual({
            items: [
                {
                    type: SuggestionItemType.EnumItem,
                    name: "value1",
                },
                {
                    type: SuggestionItemType.EnumItem,
                    name: "value2",
                },
            ],
        });
    }

    @test
    public "Не предлагать ничего на строковых атрибутах"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 optional-attr="');
        expect(suggestions).to.shallowDeepEqual({
            items: { length: 0 },
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
    public "Непустой аттрибут path у первого открывающегося тэга. Абсолютный путь"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 path="/Root/');
        expect(suggestions).to.shallowDeepEqual({
            items: [
                {
                    name: "Children1",
                    fullPath: ["Root", "Children1"],
                },
                {
                    name: "Child2",
                    fullPath: ["Root", "Child2"],
                },
                {
                    name: "attr1",
                    fullPath: ["Root", "attr1"],
                },
                {
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
    public "Непустой аттрибут path у первого открывающегося тэга. Полный путь до элемента с абсолютным путём."(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 path="/Root"><ctag3 path="');
        expect(suggestions).to.shallowDeepEqual({
            items: [
                {
                    name: "Children1",
                },
                {
                    name: "Child2",
                },
                {
                    name: "attr1",
                },
                {
                    name: "attr2",
                },
            ],
        });
    }

    @test
    public "Непустой аттрибут path у первого открывающегося тэга. Полный путь до элемента с абсолютным путём. Перекрывает предыдуший скоуп."(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 path="/Root/Child1"><atag1 path="/Root"><ctag3 path="');
        expect(suggestions).to.shallowDeepEqual({
            items: [
                {
                    name: "Children1",
                },
                {
                    name: "Child2",
                },
                {
                    name: "attr1",
                },
                {
                    name: "attr2",
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

    @test
    public "Непустой аттрибут path у тэга с суженным мутём к данным. Переход на верхний уровеь"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 path="Root/Child1/.."><ctag3 path="');
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
    public "Непустой аттрибут path у тэга с суженным мутём к данным. Переход на верхний уровеь в текущем элементе"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 path="Root/Child1"><ctag3 path="../');
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
    public "Подсказки с однокавычечными атрибутами"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest("<atag1 path='Root/Child1'><ctag3 path=\"../");
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
    public "Подсказка для атрибута type"(): void {
        this.assertSuggestions('<atag1 type="', [
            {
                type: SuggestionItemType.Type,
                name: "a-type1",
                typeKind: TypeKind.UserDefined,
            },
            {
                type: SuggestionItemType.Type,
                name: "b-type2",
                typeKind: TypeKind.UserDefined,
            },
            {
                type: SuggestionItemType.Type,
                name: "gYear",
                typeKind: TypeKind.UserDefined,
            },
            {
                type: SuggestionItemType.Type,
                name: "string",
                typeKind: TypeKind.BuiltIn,
            },
        ]);
    }

    @test
    public "Если UserDefined-тип совпадет со встроенным, то подсказываем UserDefined"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest('<atag1 type="');
        expect(suggestions.items.filter(x => x.name === "gYear").length).to.eql(1);
    }

    @test
    public "После обновления UserDefined-типов, они появляется в подсказках"(): void {
        const fileSuggester = this.createTestCompletionSuggesterWithoutTypes();
        fileSuggester.updateUserDefinedSugarType(testSugarTypes);
        const suggestions = fileSuggester.suggest('<atag1 type="');
        expect(suggestions.items).to.shallowDeepEqual([
            {
                type: SuggestionItemType.Type,
                name: "a-type1",
                typeKind: TypeKind.UserDefined,
            },
            {
                type: SuggestionItemType.Type,
                name: "b-type2",
                typeKind: TypeKind.UserDefined,
            },
            {
                type: SuggestionItemType.Type,
                name: "gYear",
                typeKind: TypeKind.UserDefined,
            },
            {
                type: SuggestionItemType.Type,
                name: "string",
                typeKind: TypeKind.BuiltIn,
            },
        ]);
    }

    @test
    public "После добавления шаблонов они появляются в подсказках"(): void {
        const fileSuggester = this.createTestCompletionSuggester();
        fileSuggester.updateUserDefinedSugarInfos(testTemplatesSugarElementInfos);
        const suggestions = fileSuggester.suggest("<");

        expect(suggestions).to.shallowDeepEqual({
            items: {
                length: 4,
                [3]: {
                    type: SuggestionItemType.Element,
                    name: "templateName",
                },
            },
        });
    }

    private assertSuggestions(textToCursor: string, items: Array<Partial<SuggestionItem>>): void {
        const fileSuggester = this.createTestCompletionSuggester();
        const suggestions = fileSuggester.suggest(textToCursor);
        expect(suggestions.items).to.shallowDeepEqual(items);
    }

    private createTestCompletionSuggester(): CompletionSuggester {
        return new CompletionSuggester(testSugarTypes, testSugarElementInfos, [], testDataSchema);
    }

    private createTestCompletionSuggesterWithoutTypes(): CompletionSuggester {
        return new CompletionSuggester([], testSugarElementInfos, [], testDataSchema);
    }
}
