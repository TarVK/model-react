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

-   Field: A data source whose value can be updated.
-   DataLoader: A data source that retrieves its value from an async callback.
-   DataCacher: A data source that caches combinations of values of other sources.
-   ActionState: A data source to track states of arbitrary async function calls.
-   ManualSourceHelper: A helper class that can be used to add state data to existing variables.

Together with some simple data hooks:

-   useDataHook: The react hook that makes an element rerender when data changes, and tracks whether the data source is still loading, or errored while loading.
-   getAsync: A function to convert a `IDataRetriever` into a promise that resolves when all data finished loading.
-   Observer: A class that can be used to create an observer that triggers a callback every time a data source updates.
-   waitFor: A function to turn a predicate involving a data source into a promise that resolves once the predicate becomes true.
-   isLoading: A function to extract the loading state out of a `IDataRetriever`.
-   getExceptions: A function to extract the exceptions out of a `IDataRetriever`.
-   createCallbackHook: A function to create a hook that can be used to get an update callback just once.

And some additional tools:

-   Loader: A react component that uses a render prop to pass the data hook, and renders alternative elements while your data is loading.
-   LoaderSwitch: A react component that allows you to pass data of your data hook to render alternative elements while your data is loading.
-   proxyHook: A function to proxy an existing data hook, and call events on updates. Primarily useful for debugging.
-   useActionState: A react hook to easily track the state of arbitrary async function calls, such that a `Loader` or `LoaderSwitch` can be used to show the state.
-   hookErrorHandler: A module that can be used to change the behavior for when a hook callback errors when triggered.

## Examples

Both TypeScript and JavaScript examples can be found on [this webpage](https://tarvk.github.io/model-react/examples/build).

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
