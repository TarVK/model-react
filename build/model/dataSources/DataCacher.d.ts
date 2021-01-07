import { AbstractDataSource } from "./AbstractDataSource";
import { IDataSource } from "../_types/IDataSource";
import { IDataHook } from "../_types/IDataHook";
/**
 * A class to create a data combiner, and cache the results
 */
export declare class DataCacher<T> extends AbstractDataSource<T> implements IDataSource<T> {
    protected source: (params: IDataHook, current: T | undefined) => T;
    protected dependencyRemovers: (() => void)[];
    protected cached: T;
    protected loading: boolean;
    protected exceptions: any[];
    protected lastLoadTime: number;
    protected isDirty: boolean;
    protected onUpdate?: (value: T, previous: T | undefined) => void;
    /**
     * Creates a new data cache, used to reduce number of calls to complex data transformers
     * @param source The function to use to compute the value
     * @param config Any additional optional configuration
     */
    constructor(source: (
    /** The data hook to forward the sources */
    hook: IDataHook, 
    /** The currently cached value */
    current: T | undefined) => T, { onUpdate, }?: {
        /** A side effect to perform after updating the now newly cached value */
        onUpdate?: (value: T, previous: T | undefined) => void;
    });
    /**
     * Updates the data if there is no dependency yet, or if a newer freshTimestamp is supplied
     * @param hook Data to know whether to reload
     */
    protected updateIfRequired(params?: IDataHook): void;
    /**
     * Forwards the state of the retriever being cached
     * @param hook Data used to notify about state changes
     */
    protected forwardState(hook?: IDataHook): void;
    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook?: IDataHook): T;
    /**
     * Destroys any potential data hook, making sure there are no memory leaks.
     * Note that this hook would clean itself up when being called anyhow, so calling destroy is not strictly necessary,
     * but it prevents potential build up of huge listener arrays that could cause a lag spike when initially called.
     */
    destroy(): void;
}
//# sourceMappingURL=DataCacher.d.ts.map