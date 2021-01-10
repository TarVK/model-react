import React from "react";
import {DataLoader, getAsync, getExceptions, isLoading} from "model-react";

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Fake api: https://reqres.in/
    const apiUrl = "https://reqres.in/api/users?delay=3";
    const {data} = await (await fetch(apiUrl)).json();
    return data[0].first_name;
}, "test");

// Create a function to force load the data
const loadData = () => {
    getAsync(h => loadableSource.get(h), Date.now())
        .then(result => alert(result))
        .catch(error => alert("Error: " + error));
};

// Create demo that gets the exceptions and loading state without forcing load
const getExceptionsDemo = () => alert(getExceptions(h => loadableSource.get(h)));
const isLoadingDemo = () => alert(isLoading(h => loadableSource.get(h)));

// Export as buttons to properly demo
export default (
    <div>
        <button children="getExceptions" onClick={getExceptionsDemo} />
        <button children="isLoading" onClick={isLoadingDemo} />
        <button children="load data" onClick={loadData} />
    </div>
);
