import {Field, Loader, waitFor} from "model-react";
import React from "react";

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Create some field to track a state, and a function to alter the state
const state = new Field("idle" as "idle" | "preparing" | "executing" | "executed");
const execute = async () => {
    if (!["idle", "executed"].includes(state.get())) return;

    state.set("preparing");
    await delay();
    state.set("executing");
    await delay();
    state.set("executed");
};

// A function to do something as soon as the state becomes "executed"
const doSomething = async () => {
    await waitFor(h => state.get(h) == "executed");
    alert("Executed"); // Note that this freezes the UI, and happens before the UI update
};

// Render an 'app' to show the controls
export default (
    <div>
        State: <Loader>{h => state.get(h)}</Loader>
        <br />
        <button onClick={execute}>Execute</button>
        <button onClick={doSomething}>Alert when executed</button>
        <button onClick={() => state.set("idle")}>Reset</button>
    </div>
);
