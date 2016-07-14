const queryParser = (state, query) => {
    if (state.bracketStack.length > 0) {
        if (state.bracketStack[0] === "{{") {
            const matchingIdx = query.indexOf("}}");
            if (matchingIdx === -1) {
                return {
                    status: "error",
                    error: "ParsingError: unmatched {{ in query",
                };
            } else {
                const parameter = query.slice(0, matchingIdx).trim();
                const rest = query.slice(matchingIdx + 2);
                return queryParser({
                    bracketStack: state.bracketStack.slice(1),
                    parameters: state.parameters.concat([parameter]),
                }, rest);
            }
        } else {
            return {
                status: "error",
                error: "AssertionError: something other than {{ " +
                       "in the bracket stack.  Stack is: " +
                       JSON.stringify(state.bracketStack),
            };
        }
    } else {
        const openIdx = query.indexOf("{{");
        if (openIdx === -1) {
            return {
                status: "success",
                parameters: state.parameters,
            };
        } else {
            const rest = query.slice(openIdx + 2);
            return queryParser({
                ...state,
                bracketStack: state.bracketStack.concat(["{{"]),
            }, rest);
        }
    }
};

module.exports = queryParser;
