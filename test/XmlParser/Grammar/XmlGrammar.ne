Root ->
    Element:* (Text Element:+):* (Element | Text):?

Element ->
	"<" Identifier _ AttributeList ">" {%
	    function ([left, id, space, attributes, right], position) {
	        console.log(space);
	        return {
	            position: {
	                start: position,
	                end: 1,
	            }
	        };
	    }
	%}
	|
	"<" Identifier _ AttributeList "/>" |
	"</" Identifier ">" {% function () { return "Element" } %}

AttributeList -> (Attribute _) :* {%
    function(d) {
        console.log(d);
        return {
            attributes: d,
            position: d,
        };
    }
%}


Attribute ->
	Identifier "=" "\"" AttributeValue "\"" {%
	    function(d, position) { 
            return {
                text: d.map(function(x) { return x.join("") }).join(""),
                position: {
                    start: position,
                    end: position + d.map(function(x) { return x.join("") }).join("").length,
                },
            };
        }
	%}
	|
	Identifier "=" "\"" AttributeValue |
	Identifier "=" "\"" |
	Identifier "=" |
	Identifier

AttributeValue -> [^\">]:+

Text -> [^<]:+ {% function (d) { return d[0].join(""); } %}

Identifier -> [\w]:+ {% function (d) { return d[0].join(""); } %}

_ -> [\s]:* {% function (d) { return d[0].join(""); } %}
