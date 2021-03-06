const ice = require("icepick");
const React = require("react");
const { StyleSheet, css } = require("aphrodite");

const Input = require("./input.jsx");
const QueryParser = require("./query-parser.js");
const Select = require("./select.jsx");
const ss = require("./shared-styles.js");
const { ParameterT } = require("./types.js");


const Param = ({ parameter, onSelect, onEdit }) => {
    return <tr className={css(styles.paramRow)}>
            <td className={css(styles.paramElement)}>{parameter.name}</td>
            <td className={css(styles.paramElement, styles.noPadding)}>
                <Select
                    onChange={onSelect}
                    options={["Date", "Constant", "Loop"]}
                    selectedValue={parameter.type}
                />
            </td>
            <td
                className={css(styles.paramElement)}
            >
                <Input
                    onChange={onEdit}
                    value={parameter.value}
                />
            </td>
    </tr>;
};

const QueryParameters = (props) => {
    /*
       TODO(colin): queryText is only used to re-parse the query so that we can
       display any errors... we should just put the errors in the store and
       avoid the second parse.
     */
    const { onChangeParameter, parameters, queryText } = props;

    const parseResult = QueryParser({
        bracketStack: [], parameters: []}, queryText);

    if (parseResult.status === "error") {
        return <div className={css(styles.parserError)}>
            {parseResult.error}
        </div>;
    } else {
        const storageForDeduping = {};
        parseResult.parameters.forEach((p) => storageForDeduping[p] = true);
        const uniqueParameters = Object.keys(storageForDeduping);
        return <table className={css(styles.table)}>
            <thead>
                <tr>
                    <td className={css(styles.paramHeader)}>Name</td>
                    <td className={css(styles.paramHeader)}>Type</td>
                    <td className={css(styles.paramHeader)}>Value</td>
                </tr>
            </thead>
            <tbody>
                {uniqueParameters.map((p) =>
                    <Param
                        key={p}
                        parameter={parameters[p] || {
                            name: p,
                            type: "Constant",
                            value: "",
                        }}
                        onEdit={(evt) => onChangeParameter({
                            name: p,
                            type: ice.getIn(
                                parameters, [p, "type"]) || "Constant",
                            value: evt.target.value,
                        })}
                        onSelect={(evt) => onChangeParameter({
                            name: p,
                            type: evt.target.value,
                            value: ice.getIn(parameters, [p, "value"]) || "",
                        })}
                    />)}
            </tbody>
        </table>;
    }
};

QueryParameters.propsTypes = {
    onChangeParameter: React.PropTypes.func,
    parameters: ParameterT,
    queryText: React.PropTypes.string,
};

const tdShared = {
    border: 0,
    margin: 0,
    paddingLeft: 10,
    paddingRight: 10,
    ':not(:last-of-type)': {
        borderRight: `2px solid ${ss.borderColor}`,
    },
};


const styles = StyleSheet.create({
    editor: {
        border: `2px solid ${ss.borderColor}`,
        borderRadius: 5,
    },
    noPadding: {
        padding: 0,
    },
    opt: {
        paddingLeft: 10,
        paddingRight: 10,
    },
    paramHeader: {
        backgroundColor: ss.backgroundColor,
        fontWeight: "bold",
        textAlign: "center",
        ...tdShared,
    },
    paramElement: {
        textAlign: "right",
        ...tdShared,
    },
    paramRow: {
        ':nth-of-type(even)': {
            backgroundColor: ss.backgroundColor,
        },
    },
    table: {
        borderCollapse: "collapse",
        minWidth: "50%",
    },
});

module.exports = QueryParameters;
