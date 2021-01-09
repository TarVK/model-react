import {ExecutionState, Field, Loader} from "model-react";
import React from "react";

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Create the data source to track executions
const field = new Field(0);

const executing = new ExecutionState();
const execute = () =>
    executing.add(async () => {
        await delay();
        field.set(Math.random());
    });

// Render some 'app' element that shows an input and output using the same field
export default (
    <div>
        <Loader onLoad="Executing">
            {h => !executing.get(h) && <button onClick={execute}>Execute</button>}
        </Loader>{" "}
        <Loader>{h => field.get(h)}</Loader>
    </div>
);
