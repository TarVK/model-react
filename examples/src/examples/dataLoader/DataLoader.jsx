import React from "react";
import {DataLoader, useDataHook} from "model-react";

// Pass a loadable data source to an element, and let the element check the state
const SomeData = ({source}) => {
    const [h, {isLoading, getExceptions}] = useDataHook();
    const data = source.get(h);

    // Check if the data is loading (after calling all the getters)
    if (isLoading()) return <div>Loading</div>;

    // Check if any error occurred
    const errors = getExceptions();
    if (errors.length !== 0) return <div>Data failed to fetch</div>;

    // Return the actual data and a reload button
    return (
        <div>
            {data} <button onClick={() => source.markDirty()}>Reload</button>
        </div>
    );
};

// Create a loadable data source anywhere, it may be part of an object, or be on its own
export const source = new DataLoader(async () => {
    // Fake api: https://reqres.in/
    const apiUrl = "https://reqres.in/api/users?delay=1";
    const {data} = await (await fetch(apiUrl)).json();
    return data[0].first_name;
}, "none"); // "none" is the initial value

// Render the 'app'
export default <SomeData source={source} />;
