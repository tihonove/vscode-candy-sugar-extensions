# Расширение Visual Studio Code для работы с Candy.Sugar 

Расширение для Visual Studio Code, которое добавляет поддержку синтаксиса sugar.xml. 
Включает поддержку основных иснтрументов навигации и валидации кода на языке sugar.xml.

## Установка

Можно установить через поиск 'vscode-candy-sugar' в панели плагинов в Visual Studio Code.

[Visual Studio Code Market Place: Candy.Sugar - IntelliSense for sugar.xml](https://marketplace.visualstudio.com/items?itemName=tihonove.vscode-candy-sugar)

Также можно использовать консоль vscode:

```
ext install vscode-candy-sugar
```

## Список функциональности

#### Валидация сахара

![Validation example](https://raw.githubusercontent.com/tihonove/vscode-candy-sugar-extensions/master/docs/images/validations.png)

Также доступна консольная версия валидатора: 
[@kontur.candy/sugar-validator](https://www.npmjs.com/package/@kontur.candy/sugar-validator)


#### Автозакрывание тэгов
![Auto close tag example](https://raw.githubusercontent.com/tihonove/vscode-candy-sugar-extensions/master/docs/images/auto-close-tag.gif)


#### Автокоплит элементов сахара: тэгов и атритутов
![Auto close tag example](https://raw.githubusercontent.com/tihonove/vscode-candy-sugar-extensions/master/docs/images/element-and-attr-completion.gif)

#### Автокоплит для определённых пользователем типов в сахаре
![User Defined Sugar Type Completion](https://raw.githubusercontent.com/tihonove/vscode-candy-sugar-extensions/master/docs/images/user-defined-sugar-type-completion.png)


#### Автокоплит путей к данным по соответствующей схеме данных
![Auto close tag example](https://raw.githubusercontent.com/tihonove/vscode-candy-sugar-extensions/master/docs/images/data-completion.gif)


#### Всплывающие подсказки для атритутов
![Auto close tag example](https://raw.githubusercontent.com/tihonove/vscode-candy-sugar-extensions/master/docs/images/attr-element-hint.gif)


#### Всплывающие подсказки для путей к данным
![Auto close tag example](https://raw.githubusercontent.com/tihonove/vscode-candy-sugar-extensions/master/docs/images/data-hint.gif)


#### Быстрый просмотр элементов схемы данных из сахара
![Auto close tag example](https://raw.githubusercontent.com/tihonove/vscode-candy-sugar-extensions/master/docs/images/data-peek-def.gif)


#### Переход к определению схемы из сахара
![Auto close tag example](https://raw.githubusercontent.com/tihonove/vscode-candy-sugar-extensions/master/docs/images/data-go-to-def.gif)


## Как помочь

* Использовать расширение и [сообщать о багах](https://github.com/tihonove/vscode-candy-sugar-extensions/issues/new?template=------------.md), [вносить предложения](https://github.com/tihonove/vscode-candy-sugar-extensions/issues/new).
* Помочь расширить и улучшить информацию об элементах сахара, внося исправления в [каталог с элементами](https://github.com/tihonove/vscode-candy-sugar-extensions/tree/master/server/src/SugarElements/DefaultSugarElementInfos) и создавая pull-request-ы. 
[Файл](https://github.com/tihonove/vscode-candy-sugar-extensions/blob/master/server/src/SugarElements/DefaultSugarElementInfos/DataElements/input.ts), в котором есть пример, как внести информацию об элементе. 
 
