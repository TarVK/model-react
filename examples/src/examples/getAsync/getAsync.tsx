import React from "react";
import {DataLoader, getAsync} from "model-react";

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Fake api: https://reqres.in/
    const apiUrl = "https://reqres.in/api/users?page=2";
    const delayedUrl = `http://slowwly.robertomurray.co.uk/delay/2000/url/${apiUrl}`;
    const {data} = await (await fetch(delayedUrl)).json();
    return data[0].first_name as string;
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
