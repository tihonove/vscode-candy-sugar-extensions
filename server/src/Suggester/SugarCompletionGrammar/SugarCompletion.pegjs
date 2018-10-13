Document = XmlPreamble? (NonElementContent / _)* Element (NonElementContent / _)*

XmlPreamble = "<?xml" _ AttributeList? _? "?>"

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

ElementName = value:[a-zA-Z0-9-_]+ {
    return value.join("");
}

AttributeList = Attribute (_? Attribute)*

Attribute =
    AttributeName (EqualsAfterAttributeName AttributeValue)?

EqualsAfterAttributeName = "{!{FAKE_NODE}!}"? "="

AttributeName = value:[a-zA-Z0-9-:_]+ {
    return value.join("");
}

AttributeValue = AttributeStringValue / AttributeJavaScriptValue

AttributeStringValue = "\"" AttributeValueContent AttributeValueClosingQuote

AttributeValueClosingQuote = "\"";

AttributeValueContent = value:[^"]* {
    return value.join("");
}

AttributeJavaScriptValue = "{" _? value: JSValue _? "}"

// JAVASCRIPT VALUE

JSValue = JSNumber / JSString / JSArray / JSObjectLiteral / JSBooleanLiteral
JSBooleanLiteral = "true" / "false"
JSArray = "[" _? ( JSValue _? ("," _? JSValue _?)* )?  _? "]"
JSNumber = [0-9.]+
JSString = ("\"" JSDoubleQuotedStringContent "\"") / ("'" JSSingleQuotedStringContent "'")
JSDoubleQuotedStringContent = ("\\\"" / [^"\n])*
JSSingleQuotedStringContent = ("\\'" / [^'\n])*
JSObjectLiteral = "{" _? JSObjectLiteralProperty (_? "," _? JSObjectLiteralProperty)* _? ","? _? "}"
JSObjectLiteralProperty = (JSString / JSPropertyName) _? ":" _? JSValue
JSPropertyName = [a-zA-Z0-9-]+


SpaceAfterElement = "{!{FAKE_NODE}!}"? _

_ = [ \r\n\t]+
