import React from "react";
import {DataLoader, getAsync} from "model-react";

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Fake api: https://reqres.in/
    const apiUrl = "https://reqres.in/api/users?delay=3";
    const {data} = await (await fetch(apiUrl)).json();
    return data[0].first_name;
}, "test");

// Convert a get to a promise fetch:
const loadData = () =>
    getAsync(h => loadableSource.get(h))
        .then(result => alert(result))
        .catch(error => alert("Error: " + error));

// Export as button to properly demo
export default (
    <div>
        <button onClick={loadData}>Trigger data load</button>
        <br />
        Also notice how the first request takes some time to load, but subsequent requests
        are instant because the data has already been fetched. This fetched value can be
        removed by marking the data source as dirty however
        <br />
        <button onClick={() => loadableSource.markDirty()}>Reset</button>
    </div>
);
