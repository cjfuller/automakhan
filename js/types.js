const React = require("react");

const ParameterT = React.PropTypes.objectOf(React.PropTypes.shape({
    name: React.PropTypes.string,
    type: React.PropTypes.oneOf(["Constant", "Date", "Loop"]),
    value: React.PropTypes.string,
}));

const FrequencyT = React.PropTypes.shape({
    'once': React.PropTypes.bool,
    'after': React.PropTypes.string,
    'cron': React.PropTypes.string,  // TODO(colin): don't use cron syntax
});

const TableT = React.PropTypes.shape({
    // Note: these names match the ones in the bigquery API.
    projectId: React.PropTypes.string,
    datasetId: React.PropTypes.string,
    tableId: React.PropTypes.string,
});

module.exports = { FrequencyT, ParameterT, TableT };
