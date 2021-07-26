import React, {useState} from "react";
import {Field, Loader, useMemoDataHook} from "model-react";

// You can then have another element that uses the same field somewhere, and it will stay synced
const SomeOutput = ({field}) => {
    // Add some state hook that will cause rerenders
    const [someData, setSomeData] = useState(false);

    // Compute expensive data only when needed, that stays subscribed to the source
    const [expensiveData] = useMemoDataHook(
        h => (field.get(h) + " ").repeat(10) + "- " + Math.random(),
        [field]
    );

    return (
        <div>
            {expensiveData} <br />
            <button onClick={() => setSomeData(t => !t)}>
                toggle {someData.toString()}
            </button>
        </div>
    );
};

// Render some 'app' element that shows an input and output using the same field, that transforms the data
const field = new Field("hoi");
export default (
    <div>
        <Loader>
            {h => (
                <input
                    type="text"
                    value={field.get(h)}
                    onChange={e => field.set(e.target.value)}
                />
            )}
        </Loader>

        <SomeOutput field={field} />
    </div>
);
