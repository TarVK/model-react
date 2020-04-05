import React from "react";
import {DataLoader, LoadableField, Loader} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// A button that allows for reloading of a data source
const SomeReload = ({source}) => (
    <button onClick={() => source.markDirty()}>Reload</button>
);

// Use a loader for both the in and output,
// since it must load the initial data from a loadable source
const SomeInput = ({field}) => (
    <Loader onLoad="Loading">
        {h => (
            <input
                type="text"
                value={field.get(h)}
                onChange={e => field.set(e.target.value)}
            />
        )}
    </Loader>
);
const SomeOutput = ({field}) => (
    <Loader onLoad="Loading" onError={e => `The following errors were thrown: ${e}`}>
        {h => <span>{field.get(h)}</span>}
    </Loader>
);

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    return `${random()}`;
}, "test");

// Create a loadable field that synchronizes with the data source
const loadableField = new LoadableField(h => loadableSource.get(h));

// Render the elements
export default (
    <div>
        <SomeInput field={loadableField} />
        <SomeOutput field={loadableField} />
        <SomeReload source={loadableSource} />
    </div>
);
