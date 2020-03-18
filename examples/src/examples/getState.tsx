import React from "react";
import {DataLoader, getAsync, getExceptions, isLoading} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 4000));

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    throw "Fake error";
}, "test");

// Create a function to force load the data
const loadData = () => {
    getAsync(h => loadableSource.get(h))
        .then(result => console.log(result))
        .catch(error => console.error(error));
};

// Create demo that gets the exceptions and loading state without forcing load
const getExceptionsDemo = () => console.log(getExceptions(h => loadableSource.get(h)));
const isLoadingDemo = () => console.log(isLoading(h => loadableSource.get(h)));

// Export as button to properly demo
export default (
    <div>
        <button children="getExceptions" onClick={getExceptionsDemo} />
        <button children="isLoading" onClick={isLoadingDemo} />
        <button children="load data" onClick={loadData} />
        See console
    </div>
);
