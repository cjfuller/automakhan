const React = require("react");
const { StyleSheet, css } = require("aphrodite");

const Select = React.createClass({
    propTypes: {
        onChange: React.PropTypes.func,
        options: React.PropTypes.arrayOf(React.PropTypes.string),
        selectedValue: React.PropTypes.string,
    },
    renderOption: function(opt, idx) {
        return <option key={opt} value={opt}>
            {opt}
        </option>;
    },
    render: function() {
        return <select
            className={css(styles.select)}
            defaultValue={this.props.selectedValue}
            onChange={this.props.onChange}
            value={this.props.selectedValue}
        >
            {this.props.options.map(this.renderOption)}
        </select>;
    },
});

const styles = StyleSheet.create({
    select: {
        '-webkit-appearance': "none",
        '-moz-appearance': "none",
        background: "none",
        border: "none",
        fontFamily: "inherit",
        fontSize: "inherit",
        height: "100%",
        paddingLeft: 10,
        paddingRight: 10,
        width: "100%",
    },
});

module.exports = Select;
