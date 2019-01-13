{
    var stack = [];
}

Document = XmlPreamble? (NonElementContent / _)* element: Element (NonElementContent / _)* {
    return element;
}

XmlPreamble = "<?xml" _ AttributeList? _? "?>"

Element =
    "<" name: ElementName SpaceAfterElement? attributes: AttributeList? _?
    content:
    (
        "/>"
        /
        (
            ">" Content "</" ElementName ">"
        )
    ) {
    if (content[0] === ">") {
        if (content[3].value !== name.value) {
            throw new peg$SyntaxError("Expecting </" + name.value + ">, but </" + content[3].value + "> found", "</" + name.value + ">", "</" + content[3].value + ">", content[3].position);
        }
    }
    const result = {
        type: "Element",
        position: location(),
        name: name,
        attributes: attributes,
        children: [],
    };
    result.name.parent = result;
    if (attributes != undefined) {
        for (const attribute of attributes) {
            attribute.parent = result;
        }
    }
    if (typeof content != "string" && content[1] != undefined) {
        for (const child of content[1]) {
            child.parent = result;
        }
        result.children = content[1];
    }
    return result;
}


Content = text: NonElementContent* rest: (Element NonElementContent*)* {
    const list = [].concat(
        (text || []),
        (rest || []).reduce((result, x) => {
            result.push(x[0]);
            result.push.apply(result, x[1] || [])
            return result;
        }, [])
    );
    var result = [];
    for (var i = 0; i < list.length; i++) {
        if (list[i] != undefined) {
            result.push(list[i]);
        }
    }
    return result;
}

NonElementContent = content: (Comment / Text) {
    return content;
}

Comment = "<!--" text: (!"-->" .)* "-->" {
    return {
        type: "Comment",
        text: text.map(x => x[1]).join(""),
        position: location(),
    };
}

Text = value: [^<]+ {
    var joinedValue = value.join("");
    if (joinedValue.trim() === "") {
        return undefined;
    }
    return {
        type: "Text",
        value: joinedValue,
        position: location(),
    };
}

ElementName = value:[a-zA-Z0-9-_]+ {
    return {
        type: "ElementName",
        value: value.join(""),
        position: location(),
    };
}

AttributeList = attribute: Attribute attributes: (_? Attribute)* {
    const list = [attribute].concat(attributes.map(x => x[1]));
    var result = [];
    for (var i = 0; i < list.length; i++) {
        result.push(list[i]);
    }
    return result;
}

Attribute =
    name: AttributeName value:(EqualsAfterAttributeName AttributeValue)? {
    const result = {
        type: "Attribute",
        name: name,
        position: location(),
        value: value && value[1],
        x: 1,
    }
    result.name.parent = result;
    if (result.value != undefined) {
        result.value.parent = result;
    }
    return result;
}

EqualsAfterAttributeName = "{!{FAKE_NODE}!}"? "="

AttributeName = value:[a-zA-Z0-9-:_]+ {
    return {
        type: "AttributeName",
        position: location(),
        value: value.join(""),
    }
}

AttributeValue = AttributeStringValue / AttributeSingleQuotedStringValue / AttributeJavaScriptValue

AttributeStringValue = "\"" value: AttributeValueContent AttributeValueClosingQuote {
    return {
        type: "AttributeValue",
        position: location(),
        value: value,
    }
}

AttributeSingleQuotedStringValue = "'" value: AttributeSingleQuotedValueContent AttributeValueSingleClosingQuote {
    return {
        type: "AttributeValue",
        position: location(),
        value: value,
    }
}

AttributeSingleQuotedValueContent = value:[^']* {
    return value.join("");
}

AttributeValueClosingQuote = "\"";
AttributeValueSingleClosingQuote = "'";

AttributeValueContent = value:[^"]* {
    return value.join("");
}

AttributeJavaScriptValue = "{" _? value: JSValue _? "}" {
    return {
        type: "AttributeJavaScriptValue",
        position: location(),
        value: value,
    }
}

// JAVASCRIPT VALUE

JSValue = value: (JSNumber / JSString / JSArray / JSObjectLiteral / JSBooleanLiteral) {
    return value;
}

JSBooleanLiteral = value: ("true" / "false") {
    return {
        type: "JavaScriptBooleanLiteral",
        value: value === "true",
    }
}

JSArray = "[" _? values: ( JSValue _? ("," _? JSValue _?)* )?  _? "]" {
    const refinedValues = [values[0]].concat(values[2].map(x => x[2]).filter(x => x != undefined));
    return {
        type: "JavaScriptArrayLiteral",
        values: refinedValues,
    }
}

JSNumber = value: [0-9.]+ {
    return {
        type: "JavaScriptNumberLiteral",
        value: Number(value.join("")),
    }
}

JSString =
    value: (
        ("\"" JSDoubleQuotedStringContent "\"") / ("'" JSSingleQuotedStringContent "'")
    ) {
        return {
            type: "JavaScriptStringLiteral",
            value: value[1],
        }
    }

JSDoubleQuotedStringContent = value: ("\\\"" / [^"\n])* {
    return value.join("");
}

JSSingleQuotedStringContent = value: ("\\'" / [^'\n])* {
    return value.join("");
}

JSObjectLiteral = "{" _? firstProp: JSObjectLiteralProperty? restProps: (_? "," _? JSObjectLiteralProperty)* _? ","? _? "}" {
    const refinedProperties = [firstProp].concat(restProps.map(x => x[3])).filter(x => x != undefined);
    return {
        type: "JavaScriptObjectLiteral",
        properties: refinedProperties,
    }
}

JSObjectLiteralProperty = name: (JSString / JSPropertyName) _? ":" _? value: JSValue {
    return {
        type: "JavaScriptObjectLiteralProperty",
        name: {
            type: "JavaScriptObjectLiteralPropertyName",
            value: name,
        },
        value: value,
    }
}

JSPropertyName = value: [a-zA-Z0-9-]+ {
    return value.join("");
}

SpaceAfterElement = "{!{FAKE_NODE}!}"? _

_ = [ \r\n\t]+
