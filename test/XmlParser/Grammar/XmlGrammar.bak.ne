Root -> Element {%
   function (children, position, reject) {
       return children[0];
   }
%}

Element -> "<" Identifier _ "/>" {%
    function ([left, identifier, space, right], position, reject) {
        return {
            type: "Node",
            position: {
                start: position,
                end:
                    left.length +
                    identifier.join("").length +
                    space[0].length +
                    right.length - 1,
            },
            tagName: identifier.join(""),
        };
    }
%}

Identifier -> [a-zA-Z]:+ {%
    function (children, position, reject) {
        return children[0];
    }
%}

_ -> [\s]:* {%
    function (children, position, reject) {
        return children;
    }
%}
