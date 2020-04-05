import React, {FC} from "react";
import {DataLoader, LoaderSwitch, useDataHook} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise<void>(res => setTimeout(res, 2000));

// Pass a loadable data source to an element, and use a loader switch to handle the state
const SomeData: FC<{source: DataLoader<number>}> = ({source}) => {
    const [h, c] = useDataHook();
    return (
        <div>
            <LoaderSwitch
                {...c} // Passes the state
                onLoad={<div>Loading</div>}
                onError={<div>Data failed to fetch</div>}>
                {source.get(h)}
            </LoaderSwitch>
            <button onClick={() => source.markDirty()}>reload</button>
        </div>
    );
};

// Create a loadable data source anywhere, it may be part of an object, or be on its own
export const source = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    return random();
}, 0); // 0 is the initial value

export default <SomeData source={source} />;
