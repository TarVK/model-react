import { AbstractDataSource } from "./AbstractDataSource";
import { IDataSource } from "../_types/IDataSource";
import { IDataRetrieverParams } from "../_types/IDataRetrieverParams";
export declare class DataCacher<T> extends AbstractDataSource<T> implements IDataSource<T> {
    protected source: (params: IDataRetrieverParams, current: T | undefined) => T;
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
    params: IDataRetrieverParams, 
    /** The currently cached value */
    current: T | undefined) => T);
    /**
     * Updates the data if there is no dependency yet, or if a newer freshTimestamp is supplied
     * @param params Data used to know whether to reload
     */
    protected updateIfRequired(params?: IDataRetrieverParams): void;
    /**
     * Forwards the state of the retriever being cached
     * @param params Data used to notify about state changes
     */
    protected forwardState(params?: IDataRetrieverParams): void;
    /**
     * Retrieves the data of a source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The data that's currently available
     */
    get(params?: IDataRetrieverParams): T;
}
