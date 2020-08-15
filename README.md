# model-react

Model-react provides a simple system to create a data model together with applicable actions for the data (methods), and easily use this data in react components.

There are three main situations when usage of this module could be considered:

-   If you render the same data in multiple places and want to manage the data neatly
-   If you have many data fetches that you want to handle in a clean manner
-   If the data has complex behavior, possibly separate of any GUI

This module has full TypeScript support, and will work well in a statically typed structured project.
A demo project written in TypeScript can be found in the demo folder, and shows off several useful constructs in models. The result can be [viewed in browser here](http://tarvk.github.io/model-react/demo/build) but is rather silly. Also note that this demo wasn't made to be mobile friendly, and generally little time was spent on the looks. This demo was made for the first version of this library and still has to be updated to show all the features of the latest version.
Example uses of all components of model-react can be found in the examples folder, or viewed below in the rest of the readme.

# Installation

```
npm install model-react --save
```

# Quickstart

## JavaScript

The example described below can be directly tested on [codesandbox](https://codesandbox.io/s/github/TarVK/model-react/tree/master/examples/JS?file=/src/quickStart.jsx).

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
    getName(h) {
        return this.name.get(h);
    }
    setAge(age) {
        this.age.set(age);
    }
    getAge(h) {
        return this.age.get(h);
    }
}

const PersonEditor = ({person}) => {
    const [h] = useDataHook();
    return (
        <div>
            <input
                value={person.getName(h)}
                onChange={e => person.setName(e.target.value)}
            />
            <input
                type="number"
                value={person.getAge(h)}
                onChange={e => person.setAge(Number(e.target.value))}
            />
        </div>
    );
};

const PersonProfile = ({person}) => {
    const [h] = useDataHook();
    return (
        <div>
            Name: {person.getName(h)} <br />
            Age: {person.getAge(h)}
        </div>
    );
};

const john = new Person("John", 1);
render(
    <div>
        <PersonEditor person={john} />
        <PersonProfile person={john} />
    </div>,
    document.getElementById("root")
);
```

## TypeScript

The example described below can be directly tested on [codesandbox](https://codesandbox.io/s/github/TarVK/model-react/tree/master/examples/TS?file=/src/quickStart.jsx).

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
    public getName(h: IDataHook): string {
        return this.name.get(h);
    }
    public setAge(age: number): void {
        this.age.set(age);
    }
    public getAge(h: IDataHook): number {
        return this.age.get(h);
    }
}

const PersonEditor: FC<{person: Person}> = ({person}) => {
    const [h] = useDataHook();
    return (
        <div>
            <input
                value={person.getName(h)}
                onChange={e => person.setName(e.target.value)}
            />
            <input
                type="number"
                value={person.getAge(h)}
                onChange={e => person.setAge(Number(e.target.value))}
            />
        </div>
    );
};

const PersonProfile: FC<{person: Person}> = ({person}) => {
    const [h] = useDataHook();
    return (
        <div>
            Name: {person.getName(h)} <br />
            Age: {person.getAge(h)}
        </div>
    );
};

const john = new Person("John", 1);
render(
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
type IDataRetriever<T> = (hook: IDataHook) => T;
```

Where IDataHook is defined as:

```ts
type IDataHook = IStrictDataHook | null;
type IStrictDataHook = IDataLoadRequest | IDataListener;
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

This retriever will simply return the current value of the model, and allow you to pass a hook.
This data can be used by a `IDataSource`:

```ts
export type IDataSource<T> = {
    /** Retrieves the data of a source
     *  @param hook Data to hook into the meta state and to notify about state changes
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
-   ActionState: A data source to track states of arbitrary async function calls

Together with some simple data hooks:

-   useDataHook: The react hook that makes an element rerender when data changes, and tracks whether the data source is still loading, or errored while loading
-   getAsync: A function to convert a `IDataRetriever` into a promise that resolves when all data finished loading
-   isLoading: A function to extract the loading state out of a `IDataRetriever`
-   getExceptions: A function to extract the exceptions out of a `IDataRetriever`

And some additional tools:

-   Loader: A react component that uses a render prop to pass the data hook, and renders alternative elements while your data is loading
-   LoaderSwitch: A react component that allows you to pass data of your data hook to render alternative elements while your data is loading
-   useActionState: A react hook to easily track the state of arbitrary async function calls, such that a `Loader` or `LoaderSwitch` can be used to show the state.

## Examples

### JavaScript

The examples described below can be directly tested on [codesandbox](https://codesandbox.io/s/github/TarVK/model-react/tree/master/examples/JS?file=/src/index.jsx).

<details><summary>Field</summary>

```jsx
import React from "react";
import {render} from "react-dom";
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
    const [h, {isLoading, getExceptions}] = useDataHook();
    const data = source.get(h);

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
            {
                h => source.get(h) // The data hook is created by the loader
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
        {h => (
            <input
                type="text"
                value={field.get(h)}
                onChange={e => field.set(e.target.value)}
            />
        )}
    </Loader>
);
const SomeOutput = ({field}) => (
    <Loader onLoad="Loading" onError={e => `The following errors were thrown: ${e}`}>
        {h => <span>{field.get(h)}</span>}
    </Loader>
);

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    return `${random()}`;
}, "test");

// Create a loadable field that synchronizes with the data source
const loadableField = new LoadableField(h => loadableSource.get(h));

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

<details><summary>Combining/transforming data</summary>
We can easily combine and 'post process' (transform) data of different data sources in this system, everything will behave as if it's only a regular source.

```jsx
import React from "react";
import {render} from "react-dom";
import {Field, useDataHook} from "model-react";

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
    return <div>{dataRetriever(h)}</div>;
};

// Create multiple fields
const field1 = new Field("hoi");
const field2 = new Field("bye");

// Create a 'transformer' that combines or transforms source data
const transformer = h => `${field1.get(h)} - ${field2.get(h)}`;

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

```jsx
import React, {useState} from "react";
import {render} from "react-dom";
import {Field, DataCacher, DataLoader, useDataHook, Loader} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

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
const transformer = h =>
    `${field1.get(h)} - ${field2.get(h)} - ${loadable.get(h)} - ${random()}`;
const cachedTransformer = new DataCacher(transformer);

// Create a component that might do meaningless rerenders
// that we don't want to recompute the transform
const Comp = () => {
    const [randomVal, setRandomVal] = useState(0);
    return (
        <>
            <SomeInput field={field1} />
            <SomeInput field={field2} /> <br />
            Not cached:
            <SomeOutput dataRetriever={transformer} />
            Cached:
            <SomeOutput dataRetriever={h => cachedTransformer.get(h)} />
            <br />
            something to make meaningless updates:
            {randomVal} <button onClick={() => setRandomVal(random())}>Rerender</button>
        </>
    );
};

// Render as element
render(<Comp />, document.body);
```

</details>

<details><summary>getAsync</summary>
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
getAsync(h => loadableSource.get(h))
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
const getSomeData = h => `${loadableSource.get(h)} - ${loadableSource.get(h)}`;

// Convert a get to a promise fetch:
getAsync(h => getSomeData(h))
    .then(result => console.log(result))
    .catch(error => console.error(error));

// Render as element
render(
    <Loader onLoad="Loading" onError={e => `The following errors were thrown: ${e}`}>
        {h => getSomeData(h)}
    </Loader>,
    document.body
);
```

</details>

<details><summary>get meta state</summary>
Data sources have a meta state that stores whether data is currently loading and whether exceptions occurred during loading. Sometimes you want to access said state from previous load requests in a synchronous way, which is what the isLoading and getExceptions hooks exist for. These don't instruct data sources to load any new data, but just check the state from data that might have been previously loaded.

```jsx
import {render} from "react-dom";
import React from "react";
import {DataLoader, getAsync, getExceptions, isLoading} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 4000));

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    throw "Fake error";
}, "test");

// Create a function to force load the data
const loadData = () => {
    getAsync(h => loadableSource.get(h))
        .then(result => console.log(result))
        .catch(error => console.error(error));
};

// Create demo that gets the exceptions and loading state without forcing load
const getExceptionsDemo = () => console.log(getExceptions(h => loadableSource.get(h)));
const isLoadingDemo = () => console.log(isLoading(h => loadableSource.get(h)));

// Render as buttons to properly demo
render(
    <div>
        <button children="getExceptions" onClick={getExceptionsDemo} />
        <button children="isLoading" onClick={isLoadingDemo} />
        <button children="load data" onClick={loadData} />
    </div>,
    document.body
);
```

</details>

<details><summary>ActionState</summary>
Action State is an advanced data source that can be used to convert the state of a promise into a meta state compatible with model-react. You can add a promise or so called 'action'/'action response' to the data source, at which point any passed hook will receive whether the promise is still loading, and any exceptions it might have thrown. This is useful for hooking into the state of asynchronous actions that aren't intended to just fetch data, but intended to change data.

```jsx
import {render} from "react-dom";
import React from "react";
import {useDataHook, ActionState, LoaderSwitch, isLoading} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// Action state sources only really make sense in combination with some async action functions
class Something {
    /**
     * Checks whether the data is saving
     * @param hook The hook to add the loading state to
     * @returns Whether we are currently saving data
     */
    isSaving(hook) {
        this.saving = new ActionState();
        this.saving.get(hook);
        return isLoading(h => this.saving.get(h));
    }

    /**
     * Performs fake save
     * @param withError Whether the fake save should mock an error
     */
    async save(withError = false) {
        return await this.saving.addAction(async () => {
            // Something async in here
            await delay();
            if (withError) throw "Error";
            console.log("Saved");
        }, true); // the true resets previous actions
    }
}
const smthInstance = new Something();

// Create some element that may use the state
const SaveButton = ({smth, error = false, children}) => {
    const [h, c] = useDataHook();
    smth.isSaving(h); // Pass the saving data to the hook
    return (
        <button
            onClick={() => {
                if (!c.isLoading()) smth.save(error);
            }}>
            <LoaderSwitch {...c} onLoad={"Saving"} onError={err => `Errored: ${err}`}>
                {children}
            </LoaderSwitch>
        </button>
    );
};

// Render some element that shows two of these save buttons, one of which causes an error
render(
    <div>
        <SaveButton smth={smthInstance}>Save</SaveButton>
        <br />
        <SaveButton smth={smthInstance} error>
            Save with error
        </SaveButton>
    </div>,
    document.body
);
```

</details>

<details><summary>useActionState</summary>
useActionState is a react hook to create a new ActionState instance, to convert any arbitrary asynchronous action to a data source. It's beneficial to create an ActionState within the data model if possible, since it keeps the state synchronized, but this hook can still be useful for external actions.

```tsx
import {render} from "react-dom";
import React from "react";
import {useDataHook, useActionState, LoaderSwitch, Loader} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise(res => setTimeout(res, 2000));

// A fake async action
const doSomething = async error => {
    await delay();
    if (error) throw "Error";
    return Math.random();
};

// Create some component that uses doSomething
const Something = ({error}) => {
    const [h, c] = useDataHook();
    const [addAction, reset, result] = useActionState(h);
    return (
        <LoaderSwitch
            {...c}
            onLoad={"Loading"}
            onError={err => (
                <>
                    Errored: {err} <button onClick={reset}>reset</button>
                </>
            )}>
            <button onClick={() => addAction(doSomething(error))}>
                perform action {error && " with error"}
            </button>
            The result is: {result}
        </LoaderSwitch>
    );
};

// Another component that uses doSomething, but inline
const SomethingInline = () => (
    <Loader onLoad={"Loading"} onError={err => `Errored: ${err}`}>
        {h => {
            const [addAction, reset, result] = useActionState(h);
            return (
                <div>
                    <button onClick={() => addAction(doSomething())}>
                        perform action
                    </button>
                    The result is: {result}
                </div>
            );
        }}
    </Loader>
);

// Multiple elements to show that data is not synchronized (ActionState in class form can be used for this)
render(
    <div>
        <Something />
        <br />
        <Something error />
        <br />
        <SomethingInline />
    </div>,
    document.body
);
```

</details>

### TypeScript

The examples described below can be directly tested on [codesandbox](https://codesandbox.io/s/github/TarVK/model-react/tree/master/examples/TS?file=/src/index.tsx).

<details><summary>Field</summary>

```tsx
import {render} from "react-dom";
import React, {FC} from "react";
import {Field, useDataHook} from "model-react";

// Pass a field as a prop to the element, and use the data hook to stay synced with it
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

// You can then have another element that uses the same field somewhere, and it will stay synced
const SomeOutput: FC<{field: Field<string>}> = ({field}) => {
    const [h] = useDataHook();
    return <div>{field.get(h)}</div>;
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
import {render} from "react-dom";
import React, {FC} from "react";
import {DataLoader, useDataHook} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise<void>(res => setTimeout(res, 2000));

// Pass a loadable data source to an element, and let the element check the state
const SomeData: FC<{source: DataLoader<number>}> = ({source}) => {
    const [h, {isLoading, getExceptions}] = useDataHook();
    const data = source.get(h);

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
import {render} from "react-dom";
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

render(<SomeData source={source} />, document.body);
```

</details>

<details><summary>Loader</summary>
The loader is almost the same as the loader switch, except that it will 'host' the listener

```tsx
import {render} from "react-dom";
import React, {FC} from "react";
import {DataLoader, Loader} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise<void>(res => setTimeout(res, 2000));

// Pass a loadable data source to an element, and use a loader switch to handle the state
const SomeData: FC<{source: DataLoader<number>}> = ({source}) => (
    <div>
        <Loader onLoad={<div>Loading</div>} onError={<div>Data failed to fetch</div>}>
            {
                h => source.get(h) // The data hook is created by the loader
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
import {render} from "react-dom";
import React, {FC} from "react";
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
        {h => (
            <input
                type="text"
                value={field.get(h)}
                onChange={e => field.set(e.target.value)}
            />
        )}
    </Loader>
);
const SomeOutput: FC<{field: LoadableField<string>}> = ({field}) => (
    <Loader onLoad="Loading" onError={e => `The following errors were thrown: ${e}`}>
        {h => <span>{field.get(h)}</span>}
    </Loader>
);

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    return `${random()}`;
}, "test");

// Create a loadable field that synchronizes with the data source
const loadableField = new LoadableField(h => loadableSource.get(h));

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

<details><summary>Combining/transforming data</summary>
We can easily combine and 'post process' (transform) data of different data sources in this system, everything will behave as if it's only a regular source.

```tsx
import {render} from "react-dom";
import React, {FC} from "react";
import {Field, useDataHook, IDataRetriever} from "model-react";

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

// Create multiple fields
const field1 = new Field("hoi");
const field2 = new Field("bye");

// Create a 'transformer' that combines or transforms source data
const transformer: IDataRetriever<string> = h => `${field1.get(h)} - ${field2.get(h)}`;

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
import {render} from "react-dom";
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
const delay = () => new Promise<void>(res => setTimeout(res, 2000));

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
    // We can use a timestamp to force a data reload no matter what the source is
    const [refreshTime, setRefreshTime] = useState(0);
    return (
        <Loader
            forceRefreshTime={refreshTime}
            onLoad={<div>Loading</div>}
            onError={<div>Data failed to fetch</div>}>
            {h => (
                <div>
                    {dataRetriever(h)}
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
const transformer: IDataRetriever<string> = h =>
    `${field1.get(h)} - ${field2.get(h)} - ${loadable.get(h)} - ${random()}`;
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
            <SomeOutput dataRetriever={h => cachedTransformer.get(h)} />
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

<details><summary>getAsync</summary>
This whole system is nice when you want to render your data, but it sucks when you just want to get some data when it's finished loading like you would with promises. As a solution the library provides a function to convert a data source get to a normal asynchronous fetch.

```ts
import {DataLoader, getAsync} from "model-react";

// A random function to generate a short random number
const random = () => Math.floor(Math.random() * 1e3) / 1e3;

// A delay function to fake some delay that would occur
const delay = () => new Promise<void>(res => setTimeout(res, 2000));

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    return `${random()}`;
}, "test");

// Convert a get to a promise fetch:
getAsync(h => loadableSource.get(h))
    .then(result => console.log(result))
    .catch(error => console.error(error));
```

</details>

<details><summary>Exceptions</summary>
Data loaders may throw errors, which are handled by the data hooks like you would expect for the most part.
The interesting behavior is that the hooks 'collect' multiple exceptions. So the `.catch` on the promise will receive an array of exceptions too. This is done because a single data retriever may have multiple exceptions, if it consists of multiple data sources.

```tsx
import {render} from "react-dom";
import React from "react";
import {DataLoader, getAsync, Loader, IDataRetriever} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise<void>(res => setTimeout(res, 2000));

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    throw "error! ";
}, "test");

// Create a transformer to have multiple sources: (or the same one multiple times)
const getSomeData: IDataRetriever<string> = h =>
    `${loadableSource.get(h)} - ${loadableSource.get(h)}`;

// Convert a get to a promise fetch:
const demo = () =>
    getAsync(h => getSomeData(h))
        .then(result => console.log(result))
        .catch(error => console.error(error));

// Render as element
render(
    <div>
        <Loader onLoad="Loading" onError={e => `The following errors were thrown: ${e}`}>
            {h => getSomeData(h)}
        </Loader>
        <br />
        <button children="demo" onClick={demo} />
    </div>,
    document.body
);
```

</details>

<details><summary>get meta state</summary>
Data sources have a meta state that stores whether data is currently loading and whether exceptions occurred during loading. Sometimes you want to access said state from previous load requests in a synchronous way, which is what the isLoading and getExceptions hooks exist for. These don't instruct data sources to load any new data, but just check the state from data that might have been previously loaded.

```tsx
import {render} from "react-dom";
import React from "react";
import {DataLoader, getAsync, getExceptions, isLoading} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise<void>(res => setTimeout(res, 4000));

// Create a data source
export const loadableSource = new DataLoader(async () => {
    // Simply returns random data after some delay, would more realistically be an async data fetch
    await delay();
    throw "Fake error";
}, "test");

// Create a function to force load the data
const loadData = () => {
    getAsync(h => loadableSource.get(h))
        .then(result => console.log(result))
        .catch(error => console.error(error));
};

// Create demo that gets the exceptions and loading state without forcing load
const getExceptionsDemo = () => console.log(getExceptions(h => loadableSource.get(h)));
const isLoadingDemo = () => console.log(isLoading(h => loadableSource.get(h)));

// Render as buttons to properly demo
render(
    <div>
        <button children="getExceptions" onClick={getExceptionsDemo} />
        <button children="isLoading" onClick={isLoadingDemo} />
        <button children="load data" onClick={loadData} />
    </div>,
    document.body
);
```

</details>

<details><summary>ActionState</summary>
Action State is an advanced data source that can be used to convert the state of a promise into a meta state compatible with model-react. You can add a promise or so called 'action'/'action response' to the data source, at which point any passed hook will receive whether the promise is still loading, and any exceptions it might have thrown. This is useful for hooking into the state of asynchronous actions that aren't intended to just fetch data, but intended to change data.

```tsx
import {render} from "react-dom";
import React, {FC, ReactNode} from "react";
import {useDataHook, ActionState, IDataHook, LoaderSwitch, isLoading} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise<void>(res => setTimeout(res, 2000));

// Action state sources only really make sense in combination with some async action functions
class Something {
    protected saving = new ActionState<void>();
    /**
     * Checks whether the data is saving
     * @param hook The hook to add the loading state to
     * @returns Whether we are currently saving data
     */
    public isSaving(hook: IDataHook): boolean {
        this.saving.get(hook);
        return isLoading(h => this.saving.get(h));
    }

    /**
     * Performs fake save
     * @param withError Whether the fake save should mock an error
     */
    public async save(withError: boolean = false): Promise<void> {
        return await this.saving.addAction(async () => {
            // Something async in here
            await delay();
            if (withError) throw "Error";
            console.log("Saved");
        }, true); // the true resets previous actions
    }
}
const smthInstance = new Something();

// Create some element that may use the state
const SaveButton: FC<{smth: Something; error?: boolean; children: ReactNode}> = ({
    smth,
    error = false,
    children,
}) => {
    const [h, c] = useDataHook();
    smth.isSaving(h); // Pass the saving data to the hook
    return (
        <button
            onClick={() => {
                if (!c.isLoading()) smth.save(error);
            }}>
            <LoaderSwitch {...c} onLoad={"Saving"} onError={err => `Errored: ${err}`}>
                {children}
            </LoaderSwitch>
        </button>
    );
};

// Render some element that shows two of these save buttons, one of which causes an error
render(
    <div>
        <SaveButton smth={smthInstance}>Save</SaveButton>
        <br />
        <SaveButton smth={smthInstance} error>
            Save with error
        </SaveButton>
    </div>,
    document.body
);
```

</details>

<details><summary>useActionState</summary>
useActionState is a react hook to create a new ActionState instance, to convert any arbitrary asynchronous action to a data source. It's beneficial to create an ActionState within the data model if possible, since it keeps the state synchronized, but this hook can still be useful for external actions.

```tsx
import {render} from "react-dom";
import React, {FC} from "react";
import {useDataHook, useActionState, LoaderSwitch, Loader} from "model-react";

// A delay function to fake some delay that would occur
const delay = () => new Promise<void>(res => setTimeout(res, 2000));

// A fake async action
const doSomething = async (error?: boolean) => {
    await delay();
    if (error) throw "Error";
    return Math.random();
};

// Create some component that uses doSomething
const Something: FC<{error?: boolean}> = ({error}) => {
    const [h, c] = useDataHook();
    const [addAction, reset, result] = useActionState<number>(h);
    return (
        <LoaderSwitch
            {...c}
            onLoad={"Loading"}
            onError={err => (
                <>
                    Errored: {err} <button onClick={reset}>reset</button>
                </>
            )}>
            <button onClick={() => addAction(doSomething(error))}>
                perform action {error && " with error"}
            </button>
            The result is: {result}
        </LoaderSwitch>
    );
};

// Another component that uses doSomething, but inline
const SomethingInline: FC = () => (
    <Loader onLoad={"Loading"} onError={err => `Errored: ${err}`}>
        {h => {
            const [addAction, reset, result] = useActionState<number>(h);
            return (
                <div>
                    <button onClick={() => addAction(doSomething())}>
                        perform action
                    </button>
                    The result is: {result}
                </div>
            );
        }}
    </Loader>
);

// Multiple elements to show that data is not synchronized (ActionState in class form can be used for this)
render(
    <div>
        <Something />
        <br />
        <Something error />
        <br />
        <SomethingInline />
    </div>,
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
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook: IDataHook): T;

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
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The data that's currently available
     */
    get(hook: IDataHook): T;

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
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook: IDataHook): T;

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
            hook: IDataHook, // The data hook to forward the sources
            current: T | undefined // The currently cached value
        ) => T
    ): LoadableField<T>;

    /**
     * Retrieves the value of the source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook: IDataHook): T;
}
```

### ActionState

A action state is able to keep track of the state of asynchronous actions. This is used to convert promises to meta data that can be read by data hooks. This can for instance be useful when wanting track whether the model is currently saving to the api, such that loaders can be shown accordingly.

#### Interface

```ts
interface ActionState<T = void> {
    /**
     * Creates a new action state, used to track the state of async actions/function calls
     */
    new(): ActionState<T = void>;

    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook: IDataHook): T[];

    /**
     * Retrieves the last added action
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The action data
     */
    getLatest(hook: IDataHook): T | undefined;

    /**
     * Adds an action to be tracked
     * @param action The to be called and tracked, or just the result promise of the action
     * @param reset Whether to remove the old data
     * @returns The result of the action
     */
    addAction(
        action: Promise<T> | (() => Promise<T>),
        reset: boolean = false
    ): Promise<T>;

    /**
     * Removes the results of previous actions
     */
    reset(): void;
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

### isLoading

isLoading can be used to extract the info of whether a data retriever is currently loading. It won't load any data itself like getAsync does, but just extracts a retriever's state.

#### Interface

```ts
/**
 * Retrieves whether data is loading from a data getter
 * @param getter The getter to get the loading state from
 * @returns Whether the getter is loading
 */
function isLoading(getter: (h: IDataHook) => void): boolean;
```

### getExceptions

getExceptions can be used to extract the exceptions a data retriever might have thrown while loading. It won't load any data itself like getAsync does, but just extracts a retriever's state.

#### Interface

```ts
/**
 * Retrieves the exceptions that were thrown by the data getter
 * @param getter The getter to get the loading state from
 * @returns The exceptions that were thrown by the getter
 */
function getExceptions(getter: (h: IDataHook) => void): any[];
```

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
    children?: (hook: IDataHook) => ReactNode;
    /** The content to show when there are no exceptions and data loaded */
    content?: (hook: IDataHook) => ReactNode;
    /** The node to show while loading */
    onLoad?: ReactNode | (() => ReactNode);
    /** The node to show if an error occured */
    onError?: ReactNode | ((exceptions: any[]) => ReactNode);
}>;
```

### useActionState

useActionState can be used to create a local ActionState data source. This source can be used to capture the state of asynchronous actions, in order to use the Loader or LoaderSwitch to visualize the loading state and or exceptions.

#### Interface

```ts
/**
 * Creates a function to use the async state of a
 * @param hook The data hook to forward the state to
 * @param latest Whether to only retrieve the last added action
 * @returns A function that promises can be wrapped with to track their state, a function to reset the state (mainly errors), and all the results
 */
export function useActionState<T = void>(
    hook: IDataHook,
    latest?: false
): [
    (
        /** The action to add, whose value will be returned */
        action: Promise<T> | (() => Promise<T>),
        /** Whether to reset the state of previously added actions */
        reset?: boolean
    ) => Promise<T>,
    () => void,
    T[]
];
```

<details>
<summary> Or get only get the last of the action values by specifying true for parameter latest </summary>

```ts
/**
 * Creates a function to use the async state of a
 * @param hook The data hook to forward the state to
 * @param latest Whether to only retrieve the last added action
 * @returns A function that promises can be wrapped with to track their state, a function to reset the state (mainly errors), and the last result
 */
function useActionState<T = void>(
    hook: IDataHook,
    latest: true
): [
    (
        /** The action to add, whose value will be returned */
        action: Promise<T> | (() => Promise<T>),
        /** Whether to reset the state of previously added actions */
        reset?: boolean
    ) => Promise<T>,
    () => void,
    T | undefined
];
```

</details>

# Limitations

## Efficiency

Since this system relies on updating observers, a large number of calls might be made before the data is actually finalized. This might be rather inefficient, and this should be considered when making complex transformers. One could also make their own DataRetriever that does some debouncing to reduce the load. This technique isn't yet included in the library however, since the provided behavior is sufficient in most situations.

# Contributing

Any contributions are welcome. The library is operational and no code changes are planned. However, if any bugs are found, or someone wants to add features or examples, they are welcome to.
Some things that I do want to add at some point are:

-   Unit tests, to ensure everything works as intended
-   A nice webpage to advertise/introduce model-react
-   Better formatted, interactive, examples/API

## Environment setup

within the main directory, examples and demo run:

```
yarn install
```

In addition, if trying to run the examples with the local model-react instance, replace:

```
"model-react": "^3.0.0",
"react": "^16.8.6",
```

by

```
"model-react": "link:../..",
"react": "link:../../node_modules/react",
```

in the example's package.json before calling yarn install

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
