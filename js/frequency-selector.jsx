const React = require("react");
const { StyleSheet, css } = require("aphrodite");

const { FrequencyT } = require("./types.js");
const Input = require("./input.jsx");

const FrequencySelector = ({ frequency, onChange }) => {
    return <div className={css(styles.outer)}>
        <div>
            <div>
                <input
                    type="radio"
                    name="frequencyselector"
                    onChange={() => onChange({once: true})}
                    value="once"
                    selected={frequency.once}
                />
                Run once
            </div>
            <div>
                <input
                    type="radio"
                    name="frequencyselector"
                    onChange={() => onChange({after: frequency.after || ""})}
                    value="after"
                    selected={frequency.after}
                />
                Run after another query completes
            </div>
            <div>
                <input
                    type="radio"
                    name="frequencyselector"
                    onChange={() => onChange({cron: frequency.cron || ""})}
                    value="cron"
                    selected={frequency.cron}
                />
                Run on a regular schedule
            </div>
        </div>
        <div className={css(styles.extraInfo)}>
            {frequency.after !== undefined ?
             <label>
                 ID of job after which to run:
                 <br />
                 <input
                     type="text"
                     name="freqvalue"
                     onChange={(evt) => onChange({after: evt.target.value})}
                     value={frequency.after}
                 />
             </label> : null}
             {frequency.cron !== undefined ?
              <label>
                  Schedule, in cron syntax:
                  <br />
                  <Input
                      name="freqvalue"
                      onChange={(evt) => onChange({cron: evt.target.value})}
                      value={frequency.cron}
                  />
              </label> : null}
        </div>
    </div>;
};

FrequencySelector.propTypes = {
    frequency: FrequencyT,
    onChange: React.PropTypes.func,
};


const styles = StyleSheet.create({
    extraInfo: {
        marginLeft: 45,
    },
    outer: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
    },
});

module.exports = FrequencySelector;
