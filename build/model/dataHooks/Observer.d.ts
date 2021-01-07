/// <reference types="node" />
import { IDataRetriever } from "../_types/IDataRetriever";
import { IDataSource } from "../_types/IDataSource";
import { IObserverListener } from "../_types/IObserverListener";
/**
 * A data hook to listen to a stream of changes
 */
export declare class Observer<T> {
    protected getter: IDataRetriever<T>;
    protected debounce: number;
    protected refreshData: boolean;
    protected listeners: IObserverListener<T>[];
    protected callListenersTimeout: undefined | NodeJS.Timeout;
    protected isDestroyed: boolean;
    protected isDirty: boolean;
    protected dependencyRemovers: (() => void)[];
    protected value: T;
    protected exceptions: any[];
    protected isLoading: boolean;
    protected initialized: boolean;
    protected previousValue: T;
    /**
     * Creates a new observer
     * @param getter The target data to observe
     * @param options Any additional configuration options
     */
    constructor(getter: IDataRetriever<T> | IDataSource<T>, { init, debounce, refreshData, }?: {
        /** Whether to call the getter, even without any listeners present */
        init?: boolean;
        /** The number of milliseconds to debounce updates, -1 to forward changes synchronously, defaults to 0 */
        debounce?: number;
        /** Whether to force data to load if it's not present yet (won't load E.G. data loaders if false), defaults to true */
        refreshData?: boolean;
    });
    /**
     * Gets the data and sets up the listener for the target
     * @param force Whether to retrieve the data even without listeners
     */
    protected getData(force?: boolean): void;
    /**
     * Gets rid of all listeners
     */
    protected removeDependencies(): void;
    /**
     * Destroys the observer, preventing it from listening to the target
     */
    destroy(): void;
    /**
     * Calls all the listeners with the loaded data
     */
    protected callListeners(): void;
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
}
//# sourceMappingURL=Observer.d.ts.map