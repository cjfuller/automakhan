const $ = require("jquery");

const Actions = require("./actions.js");
const QueryParser = require("./query-parser.js");

const submitJobDescription = (job) => {
    $.ajax({
        url: "/register_query",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(job),
    });
};

const updateDestination = (dispatch) => {
    return (fieldName, value) => dispatch({
        type: Actions.Destination,
        field: fieldName,
        value: value,
    });
};

const updateFrequency = (dispatch) => {
    return (frequency) => dispatch(
        {
            type: Actions.Frequency,
            frequency: frequency,
        });
};

const updateParameter = (dispatch) => {
    return (param) => dispatch(
        {
            type: Actions.Parameter,
            param: param,
        });
};

const updateText = (dispatch) => {
    return (codeMirror, _ch) => {
        const text = codeMirror.doc.getValue();
        dispatch({type: Actions.EditorUpdate, text: text});
        const parseResult = QueryParser(
            {bracketStack: [], parameters: []}, text);
        if (parseResult.status !== "error") {
            parseResult.parameters.forEach(
                (p) => dispatch({type: Actions.AddParameter, name: p}));
        }
    };
};

module.exports = {
    submitJobDescription,
    updateDestination,
    updateFrequency,
    updateParameter,
    updateText,
};
