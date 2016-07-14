const $ = require("jquery");

const Actions = require("./actions.js");
const QueryParser = require("./query-parser.js");

const submitJobDescription = (job) => {
    $;
    console.log(job);
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
    updateFrequency,
    updateParameter,
    updateText,
};
