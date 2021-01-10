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
-   LoadableField: A data source whose value is loaded from a data retriever, but can be changed like a field
-   DataCacher: A data source that caches combinations of values of other sources.
-   ExecutionState: A data source to track states of arbitrary async function calls.
-   ManualSourceHelper: A helper class that can be used to add state data to existing variables.

Together with some simple data hooks:

-   useDataHook: The react hook that makes an element rerender when data changes, and tracks whether the data source is still loading, or errored while loading.
-   getAsync: A function to convert a `IDataRetriever` into a promise that resolves when all data finished loading.
-   Observer: A class that can be used to create an observer that triggers a callback every time a data source updates.
-   waitFor: A function to turn a predicate involving a data source into a promise that resolves once the predicate becomes true.
-   isLoading: A function to extract the loading state out of a `IDataRetriever`.
-   getExceptions: A function to extract the exceptions out of a `IDataRetriever`.

And some additional tools:

-   Loader: A react component that uses a render prop to pass the data hook, and renders alternative elements while your data is loading.
-   LoaderSwitch: A react component that allows you to pass data of your data hook to render alternative elements while your data is loading.
-   proxyHook: A function to proxy an existing data hook, and call events on updates. Primarily useful for debugging.
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
declare class Field<T> {
    /**
     * Creates a new field
     * @param value The initial value of the field
     */
    constructor(value: T);

    /**
     * Retrieves the value of the source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook?: IDataHook): T;

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
declare class DataLoader<T> {
    /**
     * Creates a new data loader instance
     * @param loader The function to load the data with
     * @param initial The initial value of the data
     * @param dirty Whether the initial value should be overwritten when any data is requested
     * @param loadImmediately Whether the data should already be fetched despite not having been requested yet
     */
    constructor(
        loader: () => Promise<T>,
        initial: T,
        dirty: boolean = true,
        loadImmediately: boolean = false
    );

    /**
     * Retrieves the data of the source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The data that's currently available
     */
    get(hook?: IDataHook): T;

    /**
     * Indicates that this data is no longer up to date and should be reloaded
     */
    markDirty(): void;
}
```

### LoadableField

A loadable field is a combination of a data retriever and a field. It will use a data retriever to retrieve its initial value, but can be altered like a field.
The data loader takes precedence over the value that has been manually set however. This means that by default, when the data loader updates, the loadable field will copy its data overwriting the current data.

#### Interface

```ts
declare class LoadableField<T> {
    /**
     * Creates a new field that synchronizes with a data loader.
     * @param loader The loader to get the data from
     * @param updater A function to determine the new value of the field
     */
    constructor(
        loader: IDataRetriever<T>,
        updater: (
            newLoaded: T, // The latest value of the loader
            previousLoaded: T | undefined, // The previous value of the loader
            current: T // The current value of the field
        ) => T = defaultUpdater
    );

    /**
     * Retrieves the value of the source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook?: IDataHook): T;

    /**
     * Sets the new value of the field
     * @param value The new value
     */
    set(value: T): void;

    /**
     * Retrieves whether the value has been altered compared to the retriever
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns Whether the value has been altered
     */
    isDirty(hook?: IDataHook): boolean;
}
```

#### Notes

<details>
<summary>Show notes</summary>

The updater function is used to determine what the value of a field should be whenever someone accesses the data. It will be supplied with the latest value of the loader, the value that the loader had when the updater was previously called and the current value of the field. This data can be combined to determine the new value of the field. The updater that's provided by default looks as follows:

```ts
const defaultUpdater = (newLoaded: T, previousLoaded: T, current: T) =>
    newLoaded === previousLoaded ? current : newLoaded;
```

This results in the field retaining it's last assigned value, unless the loader updated its value. In this case the new loader value is taken instead. Notice that we use shallow equivalence. This may need to be replaced by deep equivalence depending on the data that the loader returns.

</details>

### DataCacher

A data cacher simply caches a value obtained from other sources. This can be used when you use the data of another source (or multiple sources), but process them in some way. The cacher makes sure that not every get request recomputes this value and only recomputes it when one of the sources it depends on asked it to recompute.

#### Interface

```ts
declare class DataCacher<T> {
    /**
     * Creates a new data cache, used to reduce number of calls to complex data transformers
     * @param source The function to use to compute the value
     * @param config Any additional optional configuration
     */
    constructor(
        source: (
            hook: IDataHook, // The data hook to forward the sources
            current: T | undefined // The currently cached value
        ) => T,
        config?: {
            /** A side effect to perform after updating the now newly cached value */
            onUpdate?: (value: T, previous: T | undefined) => void;
        }
    );

    /**
     * Retrieves the value of the source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook: IDataHook): T;

    /**
     * Destroys any potential data hook, making sure there are no memory leaks.
     * Note that this hook would clean itself up when being called anyhow, so calling destroy is not strictly necessary,
     * but it prevents potential build up of huge listener arrays that could cause a lag spike when initially called.
     */
    destroy(): void;
}
```

### ExecutionState

The execution state data source can be used to track whether any functions of a certain type are still processing. This is useful to show the user data is currently saving, and or prevent them from saving again until the previous request finishes.

#### Interface

```ts
declare class ExecutionState {
    /**
     * Creates a new execution state source
     */
    constructor();

    /**
     * Retrieves whether any promises are executing
     * @param hook The hook to subscribe to changes, and store the meta loading state
     * @returns Whether any promises are still executing
     */
    get(hook?: IDataHook): boolean;

    /**
     * Retrieves the same result as the `get` method,
     * except it doesn't pass the loading as meta state to the hook
     * @param hook The hook to subscribe to changes
     * @returns Whether any promises are executing
     */
    isLoading(hook?: IDataHook): boolean;

    /**
     * Adds a promise for which to keep track of its execution state.
     * If an asynchronous function is added, it will automatically be invoked.
     * @param promise The promise to be added
     * @returns The promise itself, for chaining
     */
    add<T>(promise: Promise<T> | (() => Promise<T>)): Promise<T>;

    /**
     * Removes a promise which may have been aded before
     * @param promise The promise to be removed
     * @returns Whether the promise was present, and not already resolved
     */
    remove(promise: Promise<any>): boolean;
}
```

### ManualSourceHelper

The ManualSourceHelper isn't strictly a data source of its own, but can be used to create a custom data source. This class can manage all of the hook data. Such that you only have to mange the real source data itself, and trigger changes using the helper when necessary.

#### Interface

```ts
declare class ManualSourceHelper {
    /**
     * Creates a new manual source helper
     * @param onLoadRequest The callback to make when a hook requests a data (re)load
     */
    constructor(onLoadRequest?: (time?: number) => void);

    /**
     * Sets any exceptions that may have occurred in the source
     * @param exceptions The exceptions to pass to listeners
     * @param suppressUpdate Whether to suppress calling the listeners
     */
    setExceptions(
        exceptions: any[] | readonly any[],
        suppressUpdate: boolean = this.exceptions == exceptions
    ): void;

    /**
     * Retrieves the exceptions that the source currently indicate to have
     * @returns The exceptions
     */
    getExceptions(): readonly any[];

    /**
     * Sets whether this source is loading
     * @param loading Whether the source is loading
     * @param suppressUpdate Whether to suppress calling the listeners
     */
    setLoading(loading: boolean, suppressUpdate: boolean = this.loading == loading): void;

    /**
     * Retrieves whether the source currently indicates to be loading
     * @returns Whether the source indicates to be loading
     */
    getLoading(): boolean;

    /**
     * Adds a listener for this field
     * @param listener The listener to add
     */
    addListener(listener?: any): void;

    /**
     * Signals all listeners that data has been altered
     */
    callListeners(): void;
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
 * @param options  Configuration options
 * @returns The data hook followed by contextual data
 */
declare function useDataHook(config?: {
    /** The time such that if data is older, it will be refreshed */
    forceRefreshTime?: number;
    /** The number of milliseconds to debounce updates, -1 to forward changes synchronously, defaults to 0 */
    debounce?: number;
    /** Code to call when a data update occurred */
    onChange?: () => void;
}): [
    IDataListener & IDataLoadRequest,
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

##### Meta data

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

##### Debounce

By default the debounce delay is set to 0. This means that if multiple updates occur in the same cycle, react won't try to rerender multiple times. This delay can be increased for sources that may update very frequently, or set to -1 for an instantaneous response.

##### forceRefreshTime

`forceRefreshTime` can be used to make sure the shown data is never from before a given time.
When this value (numeric timestamp) is provided, data will automatically refresh when too old at time of requesting the data.

</details>

### getAsync

`getAsync` can be used to transform a loadable data retriever into an async data fetch that resolves when all data finished loading.

#### Interface

```ts
/**
 * Transforms a normal data getter into a promise that resolves when the data is loaded
 * @param getter The getter function call, which applies the hook
 * @param forceRefreshTime The time such that if data is older, it will be refreshed
 * @returns A promise with the result after all data sources finished loading/refreshing
 */
declare function getAsync<T>(
    getter: (hook: IDataLoadRequest & IDataListener) => T,
    forceRefreshTime?: number
): Promise<T>;
```

#### Notes

<details>
<summary>Show notes</summary>

Since a data retriever may consist of multiple data sources, multiple errors may thrown. Therefore any error obtained using the `.catch` of the promise will be an array of thrown items.

</details>

### Observer

The observer class can be used to change a data retriever in a more traditional event based system. The observer can add listeners that will automatically be called whenever the observed data changes.

#### Interface

```ts
declare class Observer<T> {
    /**
     * Creates a new observer
     * @param getter The target data to observe
     * @param options Any additional configuration options
     */
    constructor(
        getter: IDataRetriever<T> | IDataSource<T>,
        {
            init = false,
            debounce = 0,
            refreshData = true,
        }: {
            /** Whether to call the getter, even without any listeners present */
            init?: boolean;
            /** The number of milliseconds to debounce updates, -1 to forward changes synchronously, defaults to 0 */
            debounce?: number;
            /** Whether to force data to load if it's not present yet (won't load E.G. data loaders if false), defaults to true */
            refreshData?: boolean;
        } = {}
    );

    /**
     * Adds a listener to the observer
     * @param listener The listener to add
     * @param initCall Whether to call the listener with the initial value
     * @returns This, for method chaining
     */
    listen(listener: IObserverListener<T>, initCall?: boolean): this;

    /**
     * Removes a listener from the observer
     * @param listener The listener to remove
     * @returns Whether the listener was removed
     */
    removeListener(listener: IObserverListener<T>): boolean;

    /**
     * Destroys the observer, preventing it from listening to the target
     */
    destroy(): void;
}

type IObserverListener<T> =
    /**
     * Listens for data changes in the model
     * @param data The main data provided by the model
     * @param meta The meta data of the getter
     * @param previous The previous value provided by the model (it may not be reliable if initCall=true)
     */
    (
        data: T,
        meta: {readonly isLoading: boolean; readonly exceptions: readonly any[]},
        previous: T
    ) => void;
```

#### Notes

<details>
<summary>Show notes</summary>

The forceRefreshTime and debounce time behave the same as in [useDataHook](#useDataHook).

The `previous` value that listeners receive, may be the same as the current value at the initial call in case `initCall` is used.

</details>

### waitFor

`waitFor` can be used to transform a predicate data retriever into a promise that only resolves once the predicate holds.
This should only be used in situations where it's guaranteed that the predicate will eventually hold, in order to prevent memory leaks.

#### Interface

```ts
/**
 * Waits for a condition to become true
 * @param condition The getter to get the condition result from
 * @returns A promise that resolves once the condition is met
 */
declare function waitFor(condition: (hook: IDataHook) => boolean): Promise<void>;
```

### isLoading

isLoading can be used to extract the info of whether a data retriever is currently loading. It won't load any data itself like getAsync does, but just extracts a retriever's state.

#### Interface

```ts
/**
 * Retrieves whether data is loading from a data getter
 * @param getter The getter to get the loading state from
 * @returns Whether the getter is loading
 */
declare function isLoading(getter: (h: IDataHook) => void): boolean;
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
declare function getExceptions(getter: (h: IDataHook) => void): any[];
```

## Tools

Model-react provides a couple of simple components that make dealing with loadable sources easier

### LoaderSwitch

The loader switch component can be used to easily deal with representing the state of loadable data.

#### Interface

```ts
declare const LoaderSwitch: FC<{
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
declare const Loader: FC<{
    /** An alias for content */
    children?: (hook: IDataHook) => ReactNode;
    /** The content to show when there are no exceptions and data loaded */
    content?: (hook: IDataHook) => ReactNode;
    /** The node to show while loading */
    onLoad?: ReactNode | (() => ReactNode);
    /** The node to show if an error occured */
    onError?: ReactNode | ((exceptions: any[]) => ReactNode);
    /** The time such that if data is older, it will be refreshed */
    forceRefreshTime?: number;
    /** The number of milliseconds to debounce updates, -1 to forward changes synchronously, defaults to 0 */
    debounce?: number;
}>;
```

#### Notes

<details>
<summary>Show notes</summary>

The forceRefreshTime and debounce time behave the same as in [useDataHook](#useDataHook).

</details>

### proxyHook

The `proxyHook` function can be used to wrap a hook, in order to proxy it. This way you can add additional callbacks when the hook is called, exceptions are registered or a source is indicated to be loading.
This can be useful while debugging, when you're not quite sure which source causes a certain behavior.

#### Interface

```ts
/**
 * Proxies a data hook, can be used for debugging
 * @param hook The hook to be proxied
 * @param config The config for events to listen for
 * @returns The proxied hook
 */
declare function proxyHook(
    hook: IDataHook | undefined,
    config: {
        /** The callback to perform when the hook is getting called */
        onCall?: () => void;
        /** The callback to perform when the data source indicates to be loading */
        onMarkIsLoading?: () => void;
        /** The callback to perform when the data source registers an exception */
        onRegisterException?: (data: any) => void;
    }
): IDataHook;
```

### hookErrorHandler

When a hook provides a callback that a source calls. It's possible that this callback itself errors.
These errors should be caught to prevent other (unrelated) parts of the program from not working.
`hookErrorHandler` provides a setter for a function that deals with these errors, and a function to call this handler. The default behavior is to forward all data to `console.error`.

#### Interface

```ts
/**
 * Sets the handler to call when a hook's call results in an error
 * @param handler The handler to call
 */
declare function setHookErrorHandler(handler: IDataHookErrorHandler): void;

/**
 * Handles the error that occurred when calling a data hook
 */
declare const handleHookError: IDataHookErrorHandler;

/** The error handler for hooks */
type IDataHookErrorHandler = {
    /**
     * Handles the given exception that occurred when calling a data hook
     * @param exception The exception that occurred
     * @param dataSource The data source that invoked the hook
     * @param hook The hook that got called
     * @param type The type of the call that errored
     */
    (
        exception: any,
        dataSource: any,
        hook: IDataHook | undefined,
        type: "onCall" | "registerException" | "markIsLoading"
    ): void;
};
```

# Limitations

## Efficiency

Since this system relies on updating observers, a large number of calls might be made before the data is actually finalized. This might be rather inefficient, and this should be considered when making complex transformers (in which case dataCachers are also recommended).

# Contributing

Any contributions are welcome. The library is operational and no code changes are planned. However, if any bugs are found, or someone wants to add features or examples, they are welcome to.
Some things that I do want to add at some point are:

-   Unit tests, to ensure everything works as intended
-   A nice webpage to advertise/introduce model-react
-   Better formatted, interactive, examples/API

## Environment setup

within the main directory, examples, and demo install dependencies by running:

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
