import React, {useState} from "react";
import {DataLoader, Loader, useDataHook} from "model-react";

// Pass a loadable data source to an element, and use a loader switch to handle the state
const SomeData = ({source}) => {
    const [refreshTime, setRefreshTime] = useState(0);
    // const [h] = useDataHook({forceRefreshTime: refreshTime});
    return (
        <div>
            <Loader
                forceRefreshTime={refreshTime}
                onLoad={<span>Loading</span>}
                onError={<div>Data failed to fetch</div>}>
                {
                    h => source.get(h) // The data hook is created by the loader
                }
            </Loader>{" "}
            <button onClick={() => source.markDirty()}>Reload</button>
            <button onClick={() => setRefreshTime(Date.now() - 10 * 1e3)}>
                Reload if data is more than 10 seconds old
            </button>
        </div>
    );
};

// Create a loadable data source anywhere, it may be part of an object, or be on its own
export const source = new DataLoader(async () => {
    // Fake api: https://reqres.in/
    const apiUrl = "https://reqres.in/api/users?delay=3";
    const {data} = await (await fetch(apiUrl)).json();
    return data[0].first_name;
}, "none"); // "none" is the initial value

export default <SomeData source={source} />;
