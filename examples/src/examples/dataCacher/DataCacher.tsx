import React, {FC, useState} from "react";
import {Field, DataCacher, useDataHook, IDataRetriever} from "model-react";

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
    return <div>{dataRetriever(h)}</div>;
};

// Create multiple sources
const field1 = new Field("hoi");
const field2 = new Field("bye");

// Create a virtual data source and DataCacher that caches the transformer
const transformer: IDataRetriever<string> = h =>
    `${field1.get(h)} - ${field2.get(h)} - ${Math.random()}`;
const cachedTransformer = new DataCacher(transformer);

// Create a component that might do meaningless rerenders
// that we don't want to recompute the transform
const Comp: FC = () => {
    const [enabled, setEnabled] = useState(false);
    return (
        <div>
            <SomeInput field={field1} />
            <SomeInput field={field2} /> <br />
            Not cached:
            <SomeOutput dataRetriever={transformer} />
            Cached:
            <SomeOutput dataRetriever={h => cachedTransformer.get(h)} />
            <br />
            An {enabled ? "enabled" : "disabled"} toggle that shouldn't affect the data
            sources: <button onClick={() => setEnabled(e => !e)}>Toggle</button>
        </div>
    );
};

// Render an instance of this component
export default <Comp />;
