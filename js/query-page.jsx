const Redux = require("redux");
const ReactRedux = require("react-redux");
const ReactDOM = require("react-dom");
const React = require("react");
const {StyleSheet, css} = require("aphrodite");

const Actions = require("./actions.js");
const { FrequencyT, ParameterT } = require("./types.js");
const FrequencySelector = require("./frequency-selector.jsx");
const QueryParameters = require("./query-parameters.jsx");
const ss = require("./shared-styles.js");
const {
    submitJobDescription,
    updateFrequency,
    updateParameter,
    updateText,
} = require("./action-creators.js");


const editorUpdate = (state, action) => {
    return {...state, queryText: action.text};
};

const frequencyUpdate = (state, action) => {
    return {...state, frequency: action.frequency};
};

const parameterUpdate = (state, action) => {
    const nextParameters = {...state.parameters};
    nextParameters[action.param.name] = action.param;
    return {...state, parameters: nextParameters};
};

const addParameter = (state, action) => {
    const defaultParameter = {
        type: "Constant",
        value: "",
    };
    const nextParameters = {...state.parameters};

    if (!nextParameters[action.name]) {
        nextParameters[action.name] = {
            ...defaultParameter,
            name: action.name,
        };
    }
    return {...state, parameters: nextParameters};
};

const actionHandlers = {};
actionHandlers[Actions.EditorUpdate] = editorUpdate;
actionHandlers[Actions.Parameter] = parameterUpdate;
actionHandlers[Actions.Frequency] = frequencyUpdate;
actionHandlers[Actions.AddParameter] = addParameter;

const initialState = {
    frequency: {once: true},
    parameters: {},
    queryText: "SELECT x, {{my_awesome_select}}\n" +
               "FROM [my_dataset.{{my_awesome_table}}]\n" +
               "WHERE {{some_condition}}",
};

const reducer = (state, action) => {
    console.log(action);
    if (typeof state === 'undefined') {
        return initialState;
    }
    if (actionHandlers[action.type]) {
        return actionHandlers[action.type](state, action);
    }
    return state;
};

const Store = Redux.createStore(reducer);

const QueryPage = ReactRedux.connect((s) => s)(React.createClass({
    propTypes: {
        dispatch: React.PropTypes.func,
        frequency: FrequencyT,
        parameters: ParameterT,
        queryText: React.PropTypes.string,
    },
    render: function() {
        const { dispatch, frequency, parameters, queryText } = this.props;
        return <div className={css(styles.page)}>
            Enter a query:
            <QueryEditor
                onChange={updateText(dispatch)}
            />
            Or, upload a file (TODO)
            <QueryParameters
                onChangeParameter={updateParameter(dispatch)}
                parameters={parameters}
                queryText={queryText}
            />
            When should we run it?
            <FrequencySelector
                onChange={updateFrequency(dispatch)}
                frequency={frequency}
            />
            <a
                className={css(styles.submitButton)}
                href="javascript:void(0)"
                onClick={() =>
                    submitJobDescription(Store.getState())}
            >
                Save and submit
            </a>
        </div>;
    },
}));

QueryPage.renderInto = (divId) => {
    const elt = document.getElementById(divId);
    ReactDOM.render(
        <ReactRedux.Provider store={Store}>
            <QueryPage />
        </ReactRedux.Provider>, elt);
};

const QueryEditor = React.createClass({
    propTypes: {
        onChange: React.PropTypes.func,
    },
    componentDidMount: function() {
        this.codeMirror = window.CodeMirror(
            (elt) => this.refs.editor.appendChild(elt),
            {
                mode: "sql",
                indentUnit: 4,
                lineNumbers: true,
                value: initialState.queryText,
            }
        );
        this.codeMirror.on("change", this.props.onChange);
        window.CodeMirror.signal(this.codeMirror, "change", this.codeMirror, {});
    },
    render: function() {
        return <div className={css(styles.editor)} ref="editor"></div>;
    },
});
const styles = StyleSheet.create({
    page: {
        fontFamily: ss.bodyFont,
    },
    submitButton: {
        border: `1px solid ${ss.borderColor}`,
        borderRadius: 3,
        color: "black",
        display: "inline-block",
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 3,
        paddingBottom: 3,
        textDecoration: "none",
    },
});

module.exports = QueryPage;
