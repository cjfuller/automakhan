const React = require("react");
const { StyleSheet, css } = require("aphrodite");

const Input = ({ onChange, value }) => {
    return <input
        type="text"
        className={css(styles.input)}
        value={value}
        onChange={onChange}
    />;
};

Input.propTypes = {
    onChange: React.PropTypes.func,
    value: React.PropTypes.string,
};

const styles = StyleSheet.create({
    input: {
        border: "none",
        background: "none",
        fontFamily: "inherit",
        fontSize: "inherit",
        height: "100%",
        width: "100%",
    },
});

module.exports = Input;
