import React from "react";
import {DataLoader, LoaderSwitch, useDataHook} from "model-react";

// Pass a loadable data source to an element, and use a loader switch to handle the state
const SomeData = ({source}) => {
    const [h, c] = useDataHook();
    return (
        <div>
            <LoaderSwitch
                {...c} // Passes the state
                onLoad={<span>Loading</span>}
                onError={<div>Data failed to fetch</div>}>
                {source.get(h)}
            </LoaderSwitch>{" "}
            <button onClick={() => source.markDirty()}>Reload</button>
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
