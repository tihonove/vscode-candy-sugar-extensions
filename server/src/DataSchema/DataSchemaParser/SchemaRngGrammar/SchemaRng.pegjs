Document = preamble: XmlPreamble? _? NonElementContent* body: Element _? NonElementContent* {
    return {
        preamble: preamble,
        body: body,
        position: location(),
    };
}

XmlPreamble = "<?xml" _ AttributeList? _? "?>" {
    return {
        type: "preamble",
        position: location(),
    };
}

Element =
    "<" name: ElementName attributes: (_ AttributeList)? _?
    children:
    (
            "/>"
        /
        (
            ">" Content "</" ElementName ">"
        )
    ) {
        return {
            name: name,
            attributes: attributes && attributes[1],
            children: typeof children != "string" ? children[1] : undefined,
            position: location(),
        };
    }


Content = text: NonElementContent* rest: (Element NonElementContent*)* {
    return rest.map(x => x[0]);
}

NonElementContent = Comment / text: Text {
    return text;
}

Comment = "<!--" (!"-->" .)* "-->"

Text = body: [^<]+ {
    return body.join("");
}

ElementName = value:[a-zA-Z0-9-]+ {
    return value.join("");
}

AttributeList = attribute: Attribute attributes: (_ Attribute)* {
    const list = [attribute].concat(attributes.map(x => x[1]));
    var result = {};
    for (var i = 0; i < list.length; i++) {
        result[list[i].name] = list[i].value;
    }
    return result;
}

Attribute =
    name: AttributeName value: ("=" AttributeValue)? {
    return {
        name: name,
        value: value && value[1],
    }
}

AttributeName = value:[a-zA-Z0-9-]+ {
    return value.join("");
}

AttributeValue = "\"" content: AttributeValueContent "\"" {
    return content;
}


AttributeValueContent = value:[^"]* {
    return value.join("");
}

_ = [ \r\n\t]+
