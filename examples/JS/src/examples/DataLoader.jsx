import React from "react";
import {DataLoader, useDataHook} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Pass a loadable data source to an element, and let the element check the state
const SomeData = ({source}) => {
    const [h, {isLoading, getExceptions}] = useDataHook();
    const data = source.get(h);

    // Check if the data is loading
    if (isLoading()) return <div>Loading</div>;

    // Check if any error occurred
    const errors = getExceptions();
    if (errors.length !== 0) return <div>Data failed to fetch</div>;

    // Return the actual data and a reload button
    return (
        <div>
            {data}
            <button onClick={() => source.markDirty()}>reload</button>
        </div>
    );
};

// Create a loadable data source anywhere, it may be part of an object, or be on its own
export const source = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    return random();
}, 0); // 0 is the initial value

export default <SomeData source={source} />;
