import React from "react";
import {DataLoader, getAsync} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    return `${Math.random()}`;
}, "test");

// Convert a get to a promise fetch:
const demo = () =>
    getAsync(l => loadableSource.get(l))
        .then(result => console.log(result))
        .catch(error => console.error(error));

// Export as button to properly demo
export default (
    <div>
        <button children="Demo" onClick={demo} />
        See console
    </div>
);
