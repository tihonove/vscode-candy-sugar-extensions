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
    const list = [text]
        .concat(
            (rest || []).reduce((result, x) => {
                result.push(x[0], x[1]);
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

NonElementContent = Comment / Text {
    return undefined;
}

Comment = "<!--" (!"-->" .)* "-->" {
    return {
        type: "Comment",
        position: location(),
    };
}

Text = value: [^<]+ {
    return {
        type: "Text",
        value: value.join(""),
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

JSValue = JSNumber / JSString / JSArray / JSObjectLiteral / JSBooleanLiteral
JSBooleanLiteral = "true" / "false"
JSArray = "[" _? ( JSValue _? ("," _? JSValue _?)* )?  _? "]"
JSNumber = [0-9.]+
JSString = ("\"" JSDoubleQuotedStringContent "\"") / ("'" JSSingleQuotedStringContent "'")
JSDoubleQuotedStringContent = ("\\\"" / [^"\n])*
JSSingleQuotedStringContent = ("\\'" / [^'\n])*
JSObjectLiteral = "{" _? JSObjectLiteralProperty? (_? "," _? JSObjectLiteralProperty)* _? ","? _? "}"
JSObjectLiteralProperty = (JSString / JSPropertyName) _? ":" _? JSValue
JSPropertyName = [a-zA-Z0-9-]+

SpaceAfterElement = "{!{FAKE_NODE}!}"? _

_ = [ \r\n\t]+
