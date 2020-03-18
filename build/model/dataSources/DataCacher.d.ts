import { AbstractDataSource } from "./AbstractDataSource";
import { IDataSource } from "../_types/IDataSource";
import { IDataHook } from "../_types/IDataHook";
export declare class DataCacher<T> extends AbstractDataSource<T> implements IDataSource<T> {
    protected source: (params: IDataHook, current: T | undefined) => T;
    protected dependencyRemovers: (() => void)[];
    protected cached: T;
    protected loading: boolean;
    protected exceptions: any[];
    protected lastLoadTime: number;
    /**
     * Creates a new data cache, used to reduce number of calls to complex data transformers
     * @param source The function to use to compute the value
     */
    constructor(source: (
    /** The data hook to forward the sources */
    params: IDataHook, 
    /** The currently cached value */
    current: T | undefined) => T);
    /**
     * Updates the data if there is no dependency yet, or if a newer freshTimestamp is supplied
     * @param hook Data to know whether to reload
     */
    protected updateIfRequired(params?: IDataHook): void;
    /**
     * Forwards the state of the retriever being cached
     * @param hook Data used to notify about state changes
     */
    protected forwardState(hook: IDataHook): void;
    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook: IDataHook): T;
}
