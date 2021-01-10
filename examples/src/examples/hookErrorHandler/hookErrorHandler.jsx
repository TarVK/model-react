import React from "react";
import {Field, Observer, setHookErrorHandler, useDataHook} from "model-react";

// Create some standard components
const SomeInput = ({field}) => {
    const [h] = useDataHook();
    return (
        <input
            type="text"
            value={field.get(h)}
            onChange={e => field.set(e.target.value)}
        />
    );
};

// Create a field and observer that listens to changes
const field = new Field("hoi");
const observer = new Observer(h => field.get(h)).listen(() => {
    throw "Some fake error that may occur";
});

// Set a custom handler for errors that may occur
setHookErrorHandler((exception, dataSource, hook, type) => {
    alert(exception);
});

// Render some 'app' element that shows an input
export default (
    <div>
        <SomeInput field={field} />
    </div>
);
