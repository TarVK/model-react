import React from "react";
import {
    Loader,
    ManualSourceHelper,
    useDataHook,
} from "model-react";

// Create some standard components
const SomeInput = ({getValue, setValue}) => {
    const [h] = useDataHook();
    return (
        <input type="text" value={getValue(h)} onChange={e => setValue(e.target.value)} />
    );
};
const SomeOutput = ({dataRetriever}) => (
    <Loader onLoad={<div>Changing</div>}>{h => <div>{dataRetriever(h)}</div>}</Loader>
);

// Create a custom data source using the ManualSourceHelper
let timeoutID;
let value = "hoi";
const helper = new ManualSourceHelper();
const setValue = v => {
    value = v;
    helper.callListeners();
    helper.setLoading(true);

    clearTimeout(timeoutID);
    timeoutID = setTimeout(() => {
        helper.setLoading(false);
    }, 500);
};
const getValue = hook => {
    helper.addListener(hook);
    return value;
};

// Render some 'app' element that shows an input and output using the same field
export default (
    <div>
        <SomeInput getValue={getValue} setValue={setValue} />
        <SomeOutput dataRetriever={getValue} />
    </div>
);
