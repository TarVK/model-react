import React, {FC} from "react";
import {Field, useDataHook} from "model-react";

// Pass a field as a prop to the element, and use the data hook to stay synced with it
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

// You can then have another element that uses the same field somewhere, and it will stay synced
const SomeOutput = ({field}) => {
    const [h] = useDataHook();
    return <div>{field.get(h)}</div>;
};

// Create a field anywhere, it may be part of an object, or be on its own
const field = new Field("hoi");

// Render some 'app' element that shows an input and output using the same field
export default (
    <div>
        <SomeInput field={field} />
        <SomeOutput field={field} />
    </div>
);
