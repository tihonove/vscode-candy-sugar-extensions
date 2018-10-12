Document = (NonElementContent / _)? Element (NonElementContent / _)?

Element =
    "<" ElementName SpaceAfterElement? AttributeList? _?
    (
            "/>"
        /
        (
            ">" Content "</" ElementName ">"
        )
    )



Content = NonElementContent* (Element NonElementContent*)*

NonElementContent = Comment / Text

Comment = "<!--" (!"-->" .)* "-->"

Text = [^<]+

ElementName = value:[a-zA-Z0-9-]+ {
    return value.join("");
}

AttributeList = Attribute (_ Attribute)*

Attribute =
    AttributeName (EqualsAfterAttributeName AttributeValue)?

EqualsAfterAttributeName = "{!{FAKE_NODE}!}"? "="

AttributeName = value:[a-zA-Z0-9-]+ {
    return value.join("");
}

AttributeValue = AttributeStringValue / AttributeJavaScriptValue

AttributeStringValue = "\"" AttributeValueContent AttributeValueClosingQuote

AttributeValueClosingQuote = "\"";

AttributeValueContent = value:[^"]* {
    return value.join("");
}

AttributeJavaScriptValue = "{" _? value: JavaScriptValue _? "}"

// JAVASCRIPT VALUE

JavaScriptValue = JSArray
JSArray = "[" _? ( JSValue _? ("," _? JSValue _?)* )?  _? "]"
JSValue = JSNumber / JSString / JSArray
JSNumber = [0-9.]+
JSString = "\"" JSDoubleQuotedStringContent "\""
JSDoubleQuotedStringContent = ("\\\"" / [^"\n])*


SpaceAfterElement = "{!{FAKE_NODE}!}"? _

_ = [ \r\n\t]+
