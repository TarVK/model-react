import React, {FC, useState} from "react";
import {
    Field,
    DataCacher,
    DataLoader,
    useDataHook,
    Loader,
    IDataRetriever,
} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Create some standard components
const SomeInput: FC<{field: Field<string>}> = ({field}) => {
    const [l] = useDataHook();
    return (
        <input
            type="text"
            value={field.get(l)}
            onChange={e => field.set(e.target.value)}
        />
    );
};
const SomeOutput: FC<{dataRetriever: IDataRetriever<string>}> = ({dataRetriever}) => {
    // We can use a timestamp to force a data reload no matter what the source is
    const [refreshTime, setRefreshTime] = useState(0);
    return (
        <Loader
            forceRefreshTime={refreshTime}
            onLoad={<div>Loading</div>}
            onError={<div>Data failed to fetch</div>}>
            {l => (
                <div>
                    {dataRetriever(l)}
                    <button onClick={() => setRefreshTime(Date.now())}>Reload</button>
                </div>
            )}
        </Loader>
    );
};

// Create multiple sources
const field1 = new Field("hoi");
const field2 = new Field("bye");
const loadable = new DataLoader(async () => {
    await delay();
    return random();
}, 0);

// Create a tranformer and DataCacher that caches the transformer
const transformer: IDataRetriever<string> = l =>
    `${field1.get(l)} - ${field2.get(l)} - ${loadable.get(l)} - ${random()}`;
const cachedTransformer = new DataCacher(transformer);

// Create a component that might do meaningless rerenders
// that we don't want to recompute the transform
const Comp: FC = () => {
    const [randomVal, setRandomVal] = useState(0);
    return (
        <div>
            <SomeInput field={field1} />
            <SomeInput field={field2} /> <br />
            Not cached:
            <SomeOutput dataRetriever={transformer} />
            Cached:
            <SomeOutput dataRetriever={l => cachedTransformer.get(l)} />
            <br />
            something to make meaningless updates:
            {randomVal} <button onClick={() => setRandomVal(random())}>Rerender</button>
        </div>
    );
};

// Render an instance of this component
export default <Comp />;
