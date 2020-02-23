# model-react

Model-react provides a simple system to create a data model together with applicable actions for the data (methods), and easily use this data in react components.

There are two main situations when usage of this module could be considered:

-   If you render the same data in multiple places and want to manage the data neatly
-   If the data has complex behavior, possibly separate of any GUI

This module has full TypeScript support, and will work well in a statically typed structured project.
A demo project written in TypeScript can be found in the demo folder, and shows off several useful constructs in models. The result can be [viewed in browser here](http://tarvk.github.io/model-react/demo/build) but is rather silly. Also note that this demo wasn't made mobile friendly, and generally little time was spent on the looks. This demo was made for the first version of this library and still has to be updated to show all the features of the second version.
Example uses of all components of model-react can be found in the examples folder, or viewed below in the rest of the readme.

# Installation

```
npm install model-react --save
```

# Quickstart

## JavaScript

The example described below can be directly tested on [codesandbox](https://codesandbox.io/s/model-react-v2-quickstart-javascript-4gp3y?fontsize=14&hidenavigation=1&module=%2Fsrc%2FquickStart.js&theme=dark).

```jsx
import {Field, useDataHook} from "model-react";
import React from "react";
import {render} from "react-dom";

class Person {
    constructor(name, age) {
        this.name = new Field(name);
        this.age = new Field(age);
    }
    setName(name) {
        this.name.set(name);
    }
    getName(p) {
        return this.name.get(p);
    }
    setAge(age) {
        this.age.set(age);
    }
    getAge(p) {
        return this.age.get(p);
    }
}

const PersonEditor = ({person}) => {
    const [l] = useDataHook();
    return (
        <div>
            <input
                value={person.getName(l)}
                onChange={e => person.setName(e.target.value)}
            />
            <input
                type="number"
                value={person.getAge(l)}
                onChange={e => person.setAge(Number(e.target.value))}
            />
        </div>
    );
};

const PersonProfile = ({person}) => {
    const [l] = useDataHook();
    return (
        <div>
            Name: {person.getName(l)} <br />
            Age: {person.getAge(l)}
        </div>
    );
};

const john = new Person("John", 1);
ReactDOM.render(
    <div>
        <PersonEditor person={john} />
        <PersonProfile person={john} />
    </div>,
    document.getElementById("root")
);
```

## TypeScript

The example described below can be directly tested on [codesandbox](https://codesandbox.io/s/model-react-v2-quickstart-typescript-e7v86?fontsize=14&hidenavigation=1&module=%2Fsrc%2FquickStart.tsx&theme=dark).

<details><summary>Code</summary>

```tsx
import {Field, useDataHook, IDataRetrieverParams} from "model-react";
import React, {FC} from "react";
import {render} from "react-dom";

class Person {
    protected name = new Field("");
    protected age = new Field(0);
    public constructor(name: string, age: number) {
        this.name.set(name);
        this.age.set(age);
    }
    public setName(name: string): void {
        this.name.set(name);
    }
    public getName(p: IDataRetrieverParams): string {
        return this.name.get(p);
    }
    public setAge(age: number): void {
        this.age.set(age);
    }
    public getAge(p: IDataRetrieverParams): number {
        return this.age.get(p);
    }
}

const PersonEditor: FC<{person: Person}> = ({person}) => {
    const [l] = useDataHook();
    return (
        <div>
            <input
                value={person.getName(l)}
                onChange={e => person.setName(e.target.value)}
            />
            <input
                type="number"
                value={person.getAge(l)}
                onChange={e => person.setAge(Number(e.target.value))}
            />
        </div>
    );
};

const PersonProfile: FC<{person: Person}> = ({person}) => {
    const [l] = useDataHook();
    return (
        <div>
            Name: {person.getName(l)} <br />
            Age: {person.getAge(l)}
        </div>
    );
};

const john = new Person("John", 1);
ReactDOM.render(
    <div>
        <PersonEditor person={john} />
        <PersonProfile person={john} />
    </div>,
    document.getElementById("root")
);
```

</details>

# Usage

## Premise

Model-react primarily consists of 1 design pattern, together with surrounding tools;

Model data (data of some data model) that should be accessible from a react component, should implement the IDataRetriever interface:

```ts
type IDataRetriever<T> = (params?: IDataRetrieverParams) => T;
```

Where IDateRetrieverParams is defined as:

```ts
type IDataRetrieverParams = IDataLoadRequest | IDataListener;
type IDataListener = {
    /** The method to call when the source data changes */
    readonly call: () => void;
    /** A method to register a function to be called in order to remove this listener from a data source
     *  @param remove The function to call in order to unregister this listener */
    readonly registerRemover: (remove: () => void) => void;
};
type IDataLoadRequest = {
    /** Whether data should be loaded if absent or outdated */
    readonly refreshData?: boolean;
    /** The timestamp such that data was loaded before this timestamp, it will be force reloaded */
    readonly refreshTimestamp?: number;
    /** Marks that the retrieved data should refresh,
     *  considering the refresh timestamp passed,
     *  as well a data source's own state.
     *  Should only be called synchronously. */
    readonly markShouldRefresh?: () => void;
    /** A function to pass data retrieval exceptions to
     *  @param exception An exception thrown when refreshing data */
    readonly registerException?: (error: any) => void;
};
```

This retriever will simply return the current value of the model, and allow you to pass contextual data.
This data can be used by a `IDataSource`:

```ts
export type IDataSource<T> = {
    /** Retrieves the data of a source
     *  @param params Data used to know whether to reload and to notify about state changes
     *  @returns The data that's currently available */
    get: IDataRetriever<T>;
};
```

Data sources can use `IDataListeners` to inform about changes of the value of the source, this is how react elements can hook into the data.
`IDataLoadRequests` can be used to check whether data is still loading, handle loading errors, and force data to refresh.

The library offers some simple data sources:

-   Field: A data source whose value can be updated
-   DataLoader: A data source that retrieves its value from an async callback
-   LoadableField: A data source whose value is loaded from an async callback, but can be changed like a field
-   DataCacher: A data source that caches combinations of values of other sources

Together with some simple data hooks:

-   useDataHook: The react hook that makes an element rerender when data changes, and tracks whether the data source is still loading, or errored while loading
-   getAsync: A function to convert a `IDataRetriever` into a promise that resolves when all data finished loading

And some additional tools:

-   Loader: A react component that uses a render prop to pass the data hook, and renders alternative elements while your data is loading
-   LoaderSwitch: A react component that allows you to pass data of your data hook to render alternative elements while your data is loading

## Examples

### JavaScript

The examples described below can be directly tested on [codesandbox](https://codesandbox.io/s/model-react-v2-quickstart-javascript-4gp3y?fontsize=14&hidenavigation=1&module=%2Fsrc%2FquickStart.js&theme=dark).

<details><summary>Field</summary>

```jsx
import React from "react";
import {render} from "react-dom";
import {Field, useDataHook} from "model-react";

// Pass a field as a prop to the element, and use the data hook to stay synced with it
const SomeInput = ({field}) => {
    const [l] = useDataHook();
    return (
        <input
            type="text"
            value={field.get(l)}
            onChange={e => field.set(e.target.value)}
        />
    );
};

// You can then have another element that uses the same field somewhere, and it will stay synced
const SomeOutput = ({field}) => {
    const [l] = useDataHook();
    return <div>{field.get(l)}</div>;
};

// Create a field anywhere, it may be part of an object, or be on its own
const field = new Field("hoi");

// Render some 'app' element that shows an input and output using the same field
render(
    <div>
        <SomeInput field={field} />
        <SomeOutput field={field} />
    </div>,
    document.body
);
```

</details>

<details><summary>DataLoader</summary>

```jsx
import React from "react";
import {render} from "react-dom";
import {DataLoader, useDataHook} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Pass a loadable data source to an element, and let the element check the state
const SomeData = ({source}) => {
    const [l, {isLoading, getExceptions}] = useDataHook();
    const data = source.get(l);

    // Check if the data is loading
    if (isLoading()) return <div>Loading</div>;

    // Check if any error occurred
    const errors = getExceptions();
    if (errors.length !== 0) return <div>Data failed to fetch</div>;

    // Return the actual data and a reload button
    return (
        <div>
            {data}
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

render(<SomeData source={source} />, document.body);
```

</details>

<details><summary>LoaderSwitch</summary>
The loader switch can be used to cleanly deal with the state of a loadable source

```jsx
import React from "react";
import {render} from "react-dom";
import {DataLoader, LoaderSwitch, useDataHook} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Pass a loadable data source to an element, and use a loader switch to handle the state
const SomeData = ({source}) => {
    const [l, c] = useDataHook();

    return (
        <div>
            <LoaderSwitch
                {...c} // Passes the state
                onLoad={<div>Loading</div>}
                onError={<div>Data failed to fetch</div>}>
                {source.get(l)}
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

render(<SomeData source={source} />, document.body);
```

</details>

<details><summary>Loader</summary>
The loader is almost the same as the loader switch, except that it will 'host' the listener

```jsx
import React from "react";
import {render} from "react-dom";
import {DataLoader, Loader} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Pass a loadable data source to an element, and use a loader switch to handle the state
const SomeData = ({source}) => (
    <div>
        <Loader onLoad={<div>Loading</div>} onError={<div>Data failed to fetch</div>}>
            {l => source.get(l) // The data hook is created by the loader
            }
        </Loader>
        <button onClick={() => source.markDirty()}>reload</button>
    </div>
);

// Create a loadable data source anywhere, it may be part of an object, or be on its own
export const source = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    return random();
}, 0); // 0 is the initial value

render(<SomeData source={source} />, document.body);
```

</details>

<details><summary>LoadableField</summary>
The loadable field acts like the default field, except that it will update data according to another source, which takes precedence over the local value

```jsx
import React from "react";
import {render} from "react-dom";
import {DataLoader, LoadableField, Loader} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// A button that allows for reloading of a data source
const SomeReload = ({source}) => (
    <button onClick={() => source.markDirty()}>Reload</button>
);

// Use a loader for both the in and output,
// since it must load the initial data from a loadable source
const SomeInput = ({field}) => (
    <Loader onLoad="Loading">
        {l => (
            <input
                type="text"
                value={field.get(l)}
                onChange={e => field.set(e.target.value)}
            />
        )}
    </Loader>
);
const SomeOutput = ({field}) => (
    <Loader onLoad="Loading" onError={e => `The following errors were thrown: ${e}`}>
        {l => <span>{field.get(l)}</span>}
    </Loader>
);

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    return `${random()}`;
}, "test");

// Create a loadable field that synchronizes with the data source
const loadableField = new LoadableField(t => loadableSource.get(t));

// Render the elements
render(
    <div>
        <SomeInput field={loadableField} />
        <SomeOutput field={loadableField} />
        <SomeReload source={loadableSource} />
    </div>,
    document.body
);
```

</details>

<details><summary>Combining data (transformers)</summary>
We can easily combine data of different data sources in this system, everything will behave as if it's only a single source.

```jsx
import React from "react";
import {render} from "react-dom";
import {Field, useDataHook} from "model-react";

const SomeInput = ({field}) => {
    const [l] = useDataHook();
    return (
        <input
            type="text"
            value={field.get(l)}
            onChange={e => field.set(e.target.value)}
        />
    );
};
const SomeOutput = ({dataRetriever}) => {
    const [l] = useDataHook();
    return <div>{dataRetriever(l)}</div>;
};

// Create multiple fields
const field1 = new Field("hoi");
const field2 = new Field("bye");

// Create a 'transformer' that combines or transforms source data
const transformer = l => `${field1.get(l)} - ${field2.get(l)}`;

// Render some 'app' element that shows the two fields and combined output
render(
    <div>
        <SomeInput field={field1} />
        <SomeInput field={field2} />
        <SomeOutput dataRetriever={transformer} />
    </div>,
    document.body
);
```

</details>

<details><summary>DataCacher (Caching transformers) + refreshTime</summary>
Transformers might be heavy to compute (in case the transformation itself is complex), in which case we can cache their result. This will prevent data from being recomputed when it's being accessed again. If any of the sources that it relies on update, it will automatically recompute its value to be up to date.

This example also shows how a refreshTimestamp can be passed to a Loader (can also be passed to hooks and getAsync) to force reload data of a source.

```tsx
import React from "react";
import {render} from "react-dom";
import {Field, DataCacher, DataLoader, useDataHook, Loader} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Create some standard components
const SomeInput = ({field}) => {
    const [l] = useDataHook();
    return (
        <input
            type="text"
            value={field.get(l)}
            onChange={e => field.set(e.target.value)}
        />
    );
};
const SomeOutput = ({dataRetriever}) => {
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
const transformer = l =>
    `${field1.get(l)} - ${field2.get(l)} - ${loadable.get(l)} - ${random()}`;
const cachedTransformer = new DataCacher(transformer);

// Create a component that might do meaningless rerenders
// that we don't want to recompute the transform
const Comp = () => {
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

// Render as element
render(<Comp />, document.body);
```

</details>

<details><summary>Async</summary>
This whole system is nice when you want to render your data, but it sucks when you just want to get some data when it's finished loading like you would with promises. As a solution the library provides a function to convert a data source get to a normal asynchronous fetch.

```js
import {DataLoader, getAsync} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    return `${random()}`;
}, "test");

// Convert a get to a promise fetch:
getAsync(l => loadableSource.get(l))
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

</details>

<details><summary>Exceptions</summary>
Data loaders may throw errors, which are handled by the data hooks like you would expect for the most part.
The interesting behavior is that the hooks 'collect' multiple exceptions. So the `.catch` on the promise will receive an array of exceptions too. This is done because a single data retriever may have multiple exceptions, if it consists of multiple data sources.

```jsx
import React from "react";
import {render} from "react-dom";
import {DataLoader, getAsync, Loader} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply throws an error after some delay, would more realistically be an async data fetch
    await delay();
    throw "error1! ";
}, "test");

// Create a transformer to have multiple sources: (or the same one multiple times)
const getSomeData = l => `${loadableSource.get(l)} - ${loadableSource.get(l)}`;

// Convert a get to a promise fetch:
getAsync(l => getSomeData(l))
    .then(result => console.log(result))
    .catch(error => console.error(error));

// Render as element
render(
    <Loader onLoad="Loading" onError={e => `The following errors were thrown: ${e}`}>
        {l => getSomeData(l)}
    </Loader>,
    document.body
);
```

</details>

### TypeScript

The examples described below can be directly tested on [codesandbox](https://codesandbox.io/s/model-react-v2-quickstart-typescript-e7v86?fontsize=14&hidenavigation=1&module=%2Fsrc%2FquickStart.tsx&theme=dark).

<details><summary>Field</summary>

```tsx
import React, {FC} from "react";
import {render} from "react-dom";
import {Field, useDataHook} from "model-react";

// Pass a field as a prop to the element, and use the data hook to stay synced with it
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

// You can then have another element that uses the same field somewhere, and it will stay synced
const SomeOutput: FC<{field: Field<string>}> = ({field}) => {
    const [l] = useDataHook();
    return <div>{field.get(l)}</div>;
};

// Create a field anywhere, it may be part of an object, or be on its own
const field = new Field("hoi");

// Render some 'app' element that shows an input and output using the same field
render(
    <div>
        <SomeInput field={field} />
        <SomeOutput field={field} />
    </div>,
    document.body
);
```

</details>

<details><summary>DataLoader</summary>

```tsx
import React, {FC} from "react";
import {render} from "react-dom";
import {DataLoader, useDataHook} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise<void>(res => setTimeout(res, 2000));

// Pass a loadable data source to an element, and let the element check the state
const SomeData: FC<{source: DataLoader<number>}> = ({source}) => {
    const [l, {isLoading, getExceptions}] = useDataHook();
    const data = source.get(l);

    // Check if the data is loading
    if (isLoading()) return <div>Loading</div>;

    // Check if any error occurred
    const errors = getExceptions();
    if (errors.length !== 0) return <div>Data failed to fetch</div>;

    // Return the actual data and a reload button
    return (
        <div>
            {data}
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

render(<SomeData source={source} />, document.body);
```

</details>

<details><summary>LoaderSwitch</summary>
The loader switch can be used to cleanly deal with the state of a loadable source

```tsx
import React, {FC} from "react";
import {render} from "react-dom";
import {DataLoader, LoaderSwitch, useDataHook} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise<void>(res => setTimeout(res, 2000));

// Pass a loadable data source to an element, and use a loader switch to handle the state
const SomeData: FC<{source: DataLoader<number>}> = ({source}) => {
    const [l, c] = useDataHook();
    return (
        <div>
            <LoaderSwitch
                {...c} // Passes the state
                onLoad={<div>Loading</div>}
                onError={<div>Data failed to fetch</div>}>
                {source.get(l)}
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

render(<SomeData source={source} />, document.body);
```

</details>

<details><summary>Loader</summary>
The loader is almost the same as the loader switch, except that it will 'host' the listener

```tsx
import React, {FC} from "react";
import {render} from "react-dom";
import {DataLoader, Loader} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise<void>(res => setTimeout(res, 2000));

// Pass a loadable data source to an element, and use a loader switch to handle the state
const SomeData: FC<{source: DataLoader<number>}> = ({source}) => (
    <div>
        <Loader onLoad={<div>Loading</div>} onError={<div>Data failed to fetch</div>}>
            {l => source.get(l) // The data hook is created by the loader
            }
        </Loader>
        <button onClick={() => source.markDirty()}>reload</button>
    </div>
);

// Create a loadable data source anywhere, it may be part of an object, or be on its own
export const source = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    return random();
}, 0); // 0 is the initial value

render(<SomeData source={source} />, document.body);
```

</details>

<details><summary>LoadableField</summary>
The loadable field acts like the default field, except that it will update data according to another source, which takes precedence over the local value

```tsx
import React, {FC} from "react";
import {render} from "react-dom";
import {DataLoader, LoadableField, Loader} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise<void>(res => setTimeout(res, 2000));

// A button that allows for reloading of a data source
const SomeReload: FC<{source: DataLoader<string>}> = ({source}) => (
    <button onClick={() => source.markDirty()}>Reload</button>
);

// Use a loader for both the in and output,
// since it must load the initial data from a loadable source
const SomeInput: FC<{field: LoadableField<string>}> = ({field}) => (
    <Loader onLoad="Loading">
        {l => (
            <input
                type="text"
                value={field.get(l)}
                onChange={e => field.set(e.target.value)}
            />
        )}
    </Loader>
);
const SomeOutput: FC<{field: LoadableField<string>}> = ({field}) => (
    <Loader onLoad="Loading" onError={e => `The following errors were thrown: ${e}`}>
        {l => <span>{field.get(l)}</span>}
    </Loader>
);

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    return `${random()}`;
}, "test");

// Create a loadable field that synchronizes with the data source
const loadableField = new LoadableField(t => loadableSource.get(t));

// Render the elements
render(
    <div>
        <SomeInput field={loadableField} />
        <SomeOutput field={loadableField} />
        <SomeReload source={loadableSource} />
    </div>,
    document.body
);
```

</details>

<details><summary>Combining data (transformers)</summary>
We can easily combine data of different data sources in this system, everything will behave as if it's only a single source.

```tsx
import React, {FC} from "react";
import {render} from "react-dom";
import {Field, useDataHook, IDataRetriever} from "model-react";

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
    const [l] = useDataHook();
    return <div>{dataRetriever(l)}</div>;
};

// Create multiple fields
const field1 = new Field("hoi");
const field2 = new Field("bye");

// Create a 'transformer' that combines or transforms source data
const transformer: IDataRetriever<string> = l => `${field1.get(l)} - ${field2.get(l)}`;

// Render some 'app' element that shows the two fields and combined output
render(
    <div>
        <SomeInput field={field1} />
        <SomeInput field={field2} />
        <SomeOutput dataRetriever={transformer} />
    </div>,
    document.body
);
```

</details>

<details><summary>DataCacher (Caching transformers) + refreshTime</summary>
Transformers might be heavy to compute (in case the transformation itself is complex), in which case we can cache their result. This will prevent data from being recomputed when it's being accessed again. If any of the sources that it relies on update, it will automatically recompute its value to be up to date.

This example also shows how a refreshTimestamp can be passed to a Loader (can also be passed to hooks and getAsync) to force reload data of a source.

```tsx
import React, {FC, useState} from "react";
import {render} from "react-dom";
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

// Render as element
render(<Comp />, document.body);
```

</details>

<details><summary>Async</summary>
This whole system is nice when you want to render your data, but it sucks when you just want to get some data when it's finished loading like you would with promises. As a solution the library provides a function to convert a data source get to a normal asynchronous fetch.

```ts
import {DataLoader, getAsync} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    return `${random()}`;
}, "test");

// Convert a get to a promise fetch:
getAsync(l => loadableSource.get(l))
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

</details>

<details><summary>Exceptions</summary>
Data loaders may throw errors, which are handled by the data hooks like you would expect for the most part.
The interesting behavior is that the hooks 'collect' multiple exceptions. So the `.catch` on the promise will receive an array of exceptions too. This is done because a single data retriever may have multiple exceptions, if it consists of multiple data sources.

```tsx
import React from "react";
import {render} from "react-dom";
import {DataLoader, getAsync, Loader, IDataRetriever} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply throws an error after some delay, would more realistically be an async data fetch
    await delay();
    throw "error1! ";
}, "test");

// Create a transformer to have multiple sources: (or the same one multiple times)
const getSomeData: IDataRetriever<string> = l =>
    `${loadableSource.get(l)} - ${loadableSource.get(l)}`;

// Convert a get to a promise fetch:
getAsync(l => getSomeData(l))
    .then(result => console.log(result))
    .catch(error => console.error(error));

// Render as element
render(
    <Loader onLoad="Loading" onError={e => `The following errors were thrown: ${e}`}>
        {l => getSomeData(l)}
    </Loader>,
    document.body
);
```

</details>

# API

## Data Sources

Data sources keep track of data, allow you to retrieve data and allow you to listen to changes.

### Field

A field stores a value, and allows you to change this value at any time.

#### Interface

```ts
interface Field<T> {
    /**
     * Creates a new field
     * @param value The initial value of the field
     */
    new (value: T): Field<T>;

    /**
     * Retrieves the value of the source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The value that's currently available
     */
    get(params?: IDataRetrieverParams): T;

    /**
     * Sets the new value of the field
     * @param value The new value
     */
    set(value: T): void;
}
```

### DataLoader

A data loader obtains a value from an asynchronous callback, and reloads it when either the retrieval parameter specifies it's outdated, or the loader is marked as dirty.

#### Interface

```ts
interface DataLoader<T> {
    /**
     * Creates a new data loader instance
     * @param loader The function to load the data with
     * @param initial The initial value of the data
     * @param dirty Whether the initial value should be overwritten when any data is requested
     * @param loadImmediately Whether the data should already be fetched despite not having been requested yet
     */
    new (
        loader: () => Promise<T>,
        initial: T,
        dirty: boolean = true,
        loadImmediately: boolean = false
    ): DataLoader<T>;

    /**
     * Retrieves the data of the source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The data that's currently available
     */
    get(params?: IDataRetrieverParams): T;

    /**
     * Indicates that this data is no longer up to date and should be reloaded
     */
    markDirty(): void;
}
```

### LoadableField

A loadable field is a combination of a data loader and a field. It will use a data loader to retrieve its initial value, but can be altered like a field. The data loader takes precedence over the value that has been manually set however. This means that by default, when the data loader updates, the loadable field will copy its data overwriting the current data.

#### Interface

```ts
interface LoadableField<T> {
    /**
     * Creates a new field that synchronizes with a data loader.
     * @param loader The loader to get the data from
     * @param updater A function to determine the new value of the field
     */
    new (
        loader: IDataRetriever<T>,
        updater: (
            newLoaded: T, // The latest value of the loader
            previousLoaded: T | undefined, // The previous value of the loader
            current: T // The current value of the field
        ) => T = defaultUpdater
    ): LoadableField<T>;

    /**
     * Retrieves the value of the source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The value that's currently available
     */
    get(params?: IDataRetrieverParams): T;

    /**
     * Sets the new value of the field
     * @param value The new value
     */
    set(value: T): void;
}
```

#### Notes

<details>
<summary>Show notes</summary>

The updater function is used to determine what the value of a field should be whenever someone accesses the data. It will provide the latest value of the loader, the value that the loader had when the updater was previously called and the current value of the field. This data can be combined to determine the new value of the field. The updater that's provided by default looks as follows:

```ts
const defaultUpdater = (newLoaded: T, previousLoaded: T, current: T) =>
    newLoaded === previousLoaded ? current : newLoaded;
```

This results in the field retaining it's last assigned value, unless the loader updated its value. In this case the new loader value is taken instead. Notice that we use shallow equivalence. This may need to be replaced by deep equivalence depending on the data that the loader returns.

</details>

### DataCacher

A data cacher simply caches a value obtained from other sources. This can be used when you use the data of another source (or multiple sources), but apply a slow transformation on it. The cacher makes sure that not every get request recomputes this value and only recomputes it when one of the sources it depends on asked it to recompute.

#### Interface

```ts
interface DataCacher<T> {
    /**
     * Creates a new data cache, used to reduce number of calls to complex data transformers
     * @param source The function to use to compute the value
     */
    new (
        source: (
            params: IDataRetrieverParams, // The data hook to forward the sources
            current: T | undefined // The currently cached value
        ) => T
    ): LoadableField<T>;

    /**
     * Retrieves the value of the source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The value that's currently available
     */
    get(params?: IDataRetrieverParams): T;
}
```

## Data Hooks

Data hooks are ways of accessing the data, and hooking into their state. These hooks implement the `IDataRetrieverParams` interface that was shown in the usage section.

### useDataHook

The main hook that allows you to connect component lifecycles with data sources.

#### Interface

```ts
/**
 * Retrieves a hook that can be used to listen to data from data sources,
 * such that the component rerenders upon data changes.
 * It also returns a function to determine whether the data is still loading, or has errored.
 * @param forceRefreshTime The time such that if data is older, it will be refreshed
 * @returns The data hook followed by contextual data
 */
function useDataHook(
    forceRefreshTime?: number
): [
    // The retriever params that can be passed to any data retriever call
    IDataRetrieverParams,
    {
        // Retrieves whether any obtained data is currently loading
        isLoading: () => boolean;

        // Retrieves the exceptions that may have occurred while loading
        getExceptions: () => any[];
    }
];
```

#### Notes

<details>
<summary>Show notes</summary>

The `isLoading` and `getExceptions` functions retrieve the data corresponding to retrieve calls that have been made using the return retriever params. If you try to call them before calling a retriever, it won't work as intended.

Example of what to do:

```ts
const [l, {isLoading, getExceptions}] = useDataHook();
const data = source.get(l);
const loading = isLoading();
const exceptions = getExceptions();
```

Example of what not to do:

```ts
const [l, {isLoading, getExceptions}] = useDataHook();
const loading = isLoading();
const exceptions = getExceptions();
const data = source.get(l);
```

This is why the Loader and LoaderSwitch component are particularly useful. By design of React's html element resolution, the `isLoading` and `getExceptions` functions passed to the loader will be invoked after the current element has finished executing its code block.

</details>

### getAsync

getAsync can be used to transform a loadable data retriever into an async data fetch that resolves when all data finished loading.

#### Interface

```ts
/**
 * Transforms a normal data getter into a promise that resolves when the data is loaded
 * @param getter The getter function call, which applies the hook
 * @param forceRefreshTime The time such that if data is older, it will be refreshed
 * @returns A promise with the result after all data sources finished loading/refreshing
 */
function getAsync<T>(
    getter: (hook: IDataLoadRequest & IDataListener) => T,
    forceRefreshTime?: number
): Promise<T>;
```

#### Notes

<details>
<summary>Show notes</summary>

Since a data retriever may consist of multiple data sources, multiple errors may thrown. Therefore any error obtained using the `.catch` of the promise will be an array of thrown items.

</details>

## Tools

Model-react provides a couple of simple components that make dealing with loadable sources easier

### LoaderSwitch

The loader switch component can be used to easily deal with representing the state of loadable data.

#### Interface

```ts
const LoaderSwitch: FC<{
    /** An alias for content */
    children?: ReactNode;
    /** The content to show when there are no exceptions and data loaded */
    content?: ReactNode;
    /** The node to show while loading */
    onLoad?: ReactNode | (() => ReactNode);
    /** The node to show if an error occured */
    onError?: ReactNode | ((exceptions: any[]) => ReactNode);
    /** A function to check whether the data is currently loading */
    isLoading?: () => boolean;
    /** A getter for the exceptions */
    getExceptions?: () => any[];
}>;
```

### Loader

The loader component can be used in the same situations as the loader switch, but may reduce boilerplate code by passing a hosted data hook using a render prop.

#### Interface

```ts
const Loader: FC<{
    /** An alias for content */
    children?: (hook: IDataRetrieverParams) => ReactNode;
    /** The content to show when there are no exceptions and data loaded */
    content?: (hook: IDataRetrieverParams) => ReactNode;
    /** The node to show while loading */
    onLoad?: ReactNode | (() => ReactNode);
    /** The node to show if an error occured */
    onError?: ReactNode | ((exceptions: any[]) => ReactNode);
}>;
```

# Limitations

## Efficiency

Since this system relies on updating observers, a large number of calls might be made before the data is actually finalized. This might be rather inefficient, and this should be considered when making complex transformers. One could also make their own DataRetriever that does some debouncing to reduce the load. This technique isn't yet included in the library however, since the provided behavior is sufficient in most situations.

## Bugs

The system on its own is rather simple and reliable. The usage might be a bit prone to bugs however, since providing `IDataRetrieverParams` when retrieving a value from a data source is optional. This is intentional as there are many situations where no parameters are required. It does however mean that typescript doesn't complain when you actually forget to pass the listener of a data hook in a react component, resulting in the component not updating when it should.

# Contributing

Any contributions are welcome. The library is operational and no changes are planned. However, if any bugs are found, or someone wants to add features or examples, they are welcome to.

## Environment setup

within the main directory, examples and demo run:

```
yarn install
```

## Environment usage

To test your code, in both the main directory and examples/demo run:

```
yarn start
```

This will start a dev server at localhost:3000 to view the examples which make use of the written code

To build the module or the examples/demo for production, in either folder run:

```
yarn build
```
