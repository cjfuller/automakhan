const React = require("react");

const { FrequencyT } = require("./types.js");

const FrequencySelector = ({ frequency, onChange }) => {
    return <div>
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
              Cron string (TODO: UI) for the frequency:
              <br />
              <input
                  type="text"
                  name="freqvalue"
                  onChange={(evt) => onChange({cron: evt.target.value})}
                  value={frequency.cron}
              />
          </label> : null}
    </div>;
};

FrequencySelector.propTypes = {
    frequency: FrequencyT,
    onChange: React.PropTypes.func,
};

module.exports = FrequencySelector;
