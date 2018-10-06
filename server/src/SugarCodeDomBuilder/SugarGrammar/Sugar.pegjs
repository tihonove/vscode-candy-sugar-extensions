Document = Element

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
        console.log(result.children);
    }
    return result;
}


Content = text: Text? rest: (Element Text?)* {
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

Text = value: [^<]+ {
    return {
        type: "Text",
        value: value.join(""),
        position: location(),
    };
}

ElementName = value:[a-zA-Z0-9-]+ {
    return {
        type: "ElementName",
        value: value.join(""),
        position: location(),
    };
}

AttributeList = attribute: Attribute attributes: (_ Attribute)* {
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
    }
    result.name.parent = result;
    if (result.value != undefined) {
        result.value.parent = result;
    }
    return result;
}

EqualsAfterAttributeName = "{!{FAKE_NODE}!}"? "="

AttributeName = value:[a-zA-Z0-9-]+ {
    return {
        type: "AttributeName",
        position: location(),
        value: value.join(""),
    }
}

AttributeValue = "\"" value: AttributeValueContent AttributeValueClosingQuote {
    return {
        type: "AttributeValue",
        position: location(),
        value: value,
    }
}

AttributeValueClosingQuote = "\"";

AttributeValueContent = value:[^"]* {
    return value.join("");
}

SpaceAfterElement = "{!{FAKE_NODE}!}"? _

_ = [ \r\n\t]+
