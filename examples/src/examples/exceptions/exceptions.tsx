import React from "react";
import {DataLoader, getAsync, Loader, IDataRetriever} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    throw "error!";
}, "test");

// Create a transformer to have multiple sources: (or the same one multiple times)
const getSomeData: IDataRetriever<string> = h =>
    `${loadableSource.get(h)} - ${loadableSource.get(h)}`;

// Convert a get to a promise fetch:
const loadData = () =>
    getAsync(h => getSomeData(h))
        .then(result => alert(result))
        .catch(error => alert(error));

// Render some 'app' element that shows an input and output using the same field
export default (
    <div>
        <Loader onLoad="Loading" onError={e => `The following errors were thrown: ${e}`}>
            {h => getSomeData(h)}
        </Loader>
        <br />
        <button onClick={loadData}>Load data</button>
    </div>
);
