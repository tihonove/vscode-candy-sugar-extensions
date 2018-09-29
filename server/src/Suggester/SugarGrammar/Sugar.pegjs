Document = Element

Element =
    "<" ElementName SpaceAfterElement? AttributeList? _?
    (
            "/>"
        /
        (
            ">" Content "</" ElementName ">"
        )
    )


Content = Text? (Element Text?)*

Text = [^<]+

ElementName = value:[a-zA-Z0-9]+ {
    return value.join("");
}

AttributeList = Attribute (_ Attribute)*

Attribute =
    AttributeName (EqualsAfterAttributeName AttributeValue)?

EqualsAfterAttributeName = "{!{FAKE_NODE}!}"? "="

AttributeName = value:[a-zA-Z0-9]+ {
    return value.join("");
}

AttributeValue = "\"" AttributeValueContent AttributeValueClosingQuote

AttributeValueClosingQuote = "\"";

AttributeValueContent = value:[^"]* {
    return value.join("");
}

SpaceAfterElement = "{!{FAKE_NODE}!}"? _

_ = [ \r\n\t]+
