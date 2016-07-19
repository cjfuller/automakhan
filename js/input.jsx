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
        borderBottom: "1px solid #ccc",
        background: "none",
        fontFamily: "inherit",
        fontSize: "inherit",
        width: "100%",
        ':focus': {
            outline: 0,
            borderBottom: "1px solid black",
        },
    },
});

module.exports = Input;
