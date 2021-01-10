import React, {FC} from "react";
import {Field, useDataHook, proxyHook, IDataRetriever} from "model-react";

// Create some standard components
const SomeInput: FC<{field: Field<string>}> = ({field}) => {
    const [h] = useDataHook();
    return (
        <input
            type="text"
            value={field.get(h)}
            onChange={e => field.set(e.target.value)}
        />
    );
};
const SomeOutput: FC<{dataRetriever: IDataRetriever<string>}> = ({dataRetriever}) => {
    const [h] = useDataHook();
    return (
        <div>
            {dataRetriever(
                // Proxy the hook in order to execute additional code on a callback
                proxyHook(h, {
                    onCall: () => console.log(dataRetriever()),
                })
            )}
        </div>
    );
};

// Create a field anywhere, it may be part of an object, or be on its own
const field = new Field("hoi");

// Render some 'app' element that shows an input and output using the same field
export default (
    <div>
        <SomeInput field={field} />
        <SomeOutput dataRetriever={h => field.get(h)} />
        Check the console
    </div>
);
