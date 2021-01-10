import {Field, Observer, useDataHook} from "model-react";
import React from "react";

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
const SomeOutput = ({dataRetriever}) => {
    const [h] = useDataHook();
    return (
        <div>
            {dataRetriever(h).map((item, i) => (
                <div key={i}>{item}</div>
            ))}
        </div>
    );
};

// Create some input field, and an output field
const inpField = new Field("hoi");
const outField = new Field([]);

// Use an observer to subscribe to any changes to the input, and add them to the output
const observer = new Observer(h => inpField.get(h));
observer.listen((value, {exceptions, isLoading}, prevValue) => {
    outField.set([...outField.get(), value]);
});
// observer.destroy();

// Render some 'app' element that shows an input and output data
export default (
    <div>
        <SomeInput field={inpField} />
        <SomeOutput dataRetriever={h => outField.get(h)} />
        <button onClick={() => outField.set([])}>reset</button>
    </div>
);
