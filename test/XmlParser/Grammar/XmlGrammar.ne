Root ->
    Element:* (Text Element:+):* (Element | Text):? {%
        function ([elements, textAndElements, elementOrText]) {
            return [].concat(
                elements,
                textAndElements
                    .map(([text, elements]) => [text, ...elements])
                    .reduce((x, y) => [].concat(x, y), [])
                    .filter(x => x != null),
                elementOrText == null ? [] : elementOrText
            );
        }
    %}


@{%
    function elementVariation(type) {
        return function (d, start) {
            const body = d.map(x => typeof x === "string" ? x : x.body).join("");
            return {
                body: body,
                type: type,
                position: {
                    start: start,
                    end: start + body.length - 1,
                }
            };
        };
    }

    function elementVariationWithAttributes(type) {
        return function (d, start) {
            const body = d.map(x => typeof x === "string" ? x : x.body).join("");
            const [,,,attributes] = d;
            console.log(attributes);
            return {
                body: body,
                type: type,
                attributes: attributes.items,
                position: {
                    start: start,
                    end: start + body.length - 1,
                }
            };
        };
    }
%}

Element ->
    "<" Identifier _ ">" {% elementVariation("tag") %}
    |
	"<" Identifier __ AttributeList ">" {% elementVariationWithAttributes("tag") %}
	|
	"<" Identifier __ AttributeList "/>"  {% elementVariationWithAttributes("selfClosingTag") %}
	|
	"</" Identifier ">"  {% elementVariation("closingTag") %}
	|
	"<" Identifier _ {% elementVariation("tag") %}

AttributeList -> (Attribute _) :* {%
    function([attributes], start) {
        const body = attributes.map((attr) => {
            return attr.map(x => typeof x === "string" ? x : x.body).join("")
        }).join("");
        return {
            body: body,
            position: {
                start: start,
                end: start + body.length - 1,
            },
            items: attributes
                .reduce((x, y) => [].concat(x, y), [])
                .filter(x => x.type === "attribute"),
        };
    }
%}

@{%
    function attributeVariation(d, start) {
        const body = d.map(x => typeof x === "string" ? x : x.body).join("");
        return {
            type: "attribute",
            body: body,
            position: {
                start: start,
                end: start + body.length - 1,
            },
        };
    }
%}

Attribute ->
	Identifier "=" "\"" AttributeValue "\"" {% attributeVariation %} |
	Identifier "=" "\"" AttributeValue {% attributeVariation %}  |
	Identifier "=" "\"" {% attributeVariation %}  |
	Identifier "=" {% attributeVariation %}  |
	Identifier  {% attributeVariation %}

AttributeValue -> [^\">]:+ {%
    function (d, start) {
        const body = d[0].join("");
        return {
            body: body,
            position: {
                start: start,
                end: start + body.length - 1,
            },
        }
    }
%}

Text -> [^<]:+ {%
    function (d, start) {
        const body = d[0].join("");
        return {
            type: "text",
            body: body,
            position: {
                start: start,
                end: start + body.length - 1,
            },
        };
    }
%}

Identifier -> [\w]:+ {%
    function (d, start) {
        const body = d[0].join("");
        return {
            body: body,
            position: {
                start: start,
                end: start + body.length - 1,
            },
        };
    }
%}

_ -> [\s]:* {% function (d) { return d[0].join(""); } %}
__ -> [\s]:+ {% function (d) { return d[0].join(""); } %}
