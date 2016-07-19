const React = require("react");
const ReactDOM = require("react-dom");
const { StyleSheet, css } = require("aphrodite");

const ss = require("./shared-styles.js");

const prefetchedData = window._prefetch;

function frequencyString(freq) {
    if (freq.once !== undefined) {
        return "once";
    }
    if (freq.after !== undefined) {
        return `After job id: ${freq.after}`;
    }
    return `Repeating: ${freq.cron}`;
}

function rowsFromData(data) {
    return Object.keys(data).map((id) => {
        return <tr key={id} className={css(styles.tr)}>
            <td className={css(styles.td)}>
                {id}
            </td>
            <td className={css(styles.td)}>
                {frequencyString(data[id].frequency)}
            </td>
            <td className={css(styles.td)}>
                {data[id].queryText.slice(0, 40)}
            </td>
        </tr>;
    });
}

console.log(prefetchedData);

const QueryList = React.createClass({
    render: function() {
        return <div className={css(styles.page)}>
            <div className={css(styles.header)}>
                Listing all scheduled jobs
            </div>
            <table className={css(styles.table)}>
                <thead>
                    <tr>
                        <td className={css(styles.th)}>Job ID</td>
                        <td className={css(styles.th)}>Schedule</td>
                        <td className={css(styles.th)}>Query</td>
                    </tr>
                </thead>
                <tbody>
                    {rowsFromData(prefetchedData)}
                </tbody>
            </table>
        </div>;
    },
});

QueryList.renderInto = function(id) {
    ReactDOM.render(<QueryList />,
                    document.getElementById(id));
};

const styles = StyleSheet.create({
    header: {
        fontSize: "1.1em",
        fontWeight: "bold",
    },
    page: {
        fontFamily: ss.bodyFont,
    },
    subHeader: {
        fontWeight: "bold",
    },
    table: {
        borderCollapse: "collapse",
    },
    td: {
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
    },
    tr: {
        ':nth-of-type(even)': {
            backgroundColor: ss.backgroundColor,
        },
    },
    th: {
        backgroundColor: ss.backgroundColor,
        fontWeight: "bold",
        paddingLeft: 10,
        paddingRight: 10,
    },
});

module.exports = QueryList;
