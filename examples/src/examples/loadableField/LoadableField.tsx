import React, {FC} from "react";
import {DataLoader, LoadableField, Loader} from "model-react";

// Create some standard components
const SomeInput: FC<{field: LoadableField<string>}> = ({field}) => (
    <Loader onLoad="Loading">
        {h => (
            <input
                type="text"
                value={field.get(h)}
                onChange={e => field.set(e.target.value)}
            />
        )}
    </Loader>
);

// Create a data source, and use it to create a loadable field
let index = 0;
export const loadableSource = new DataLoader(async () => {
    // Fake api: https://reqres.in/
    const apiUrl = "https://reqres.in/api/users?delay=1";
    const {data} = await (await fetch(apiUrl)).json();
    const person = data[index++ % 2]; // Cycle between 2 people, to force an update
    return person.first_name;
}, "none"); // "none" is the initial value

const loadableField = new LoadableField(h => loadableSource.get(h));

// Render some 'app' element that shows an input and output using the same field
export default (
    <div>
        <SomeInput field={loadableField} />
        <button onClick={() => loadableSource.markDirty()}>Reload</button>
    </div>
);
