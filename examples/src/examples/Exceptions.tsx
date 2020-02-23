import React from "react";
import {DataLoader, getAsync, Loader, IDataRetriever} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    throw "error! ";
}, "test");

// Create a transformer to have multiple sources: (or the same one multiple times)
const getSomeData: IDataRetriever<string> = l =>
    `${loadableSource.get(l)} - ${loadableSource.get(l)}`;

// Convert a get to a promise fetch:
const demo = () =>
    getAsync(l => getSomeData(l))
        .then(result => console.log(result))
        .catch(error => console.error(error));

// Render as element
export default (
    <>
        <Loader onLoad="Loading" onError={e => `The following errors were thrown: ${e}`}>
            {l => getSomeData(l)}
        </Loader>
        <br />
        <button children="demo" onClick={demo} />
    </>
);
