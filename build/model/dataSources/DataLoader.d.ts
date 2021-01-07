import { AbstractDataSource } from "./AbstractDataSource";
import { IDataLoadRequest } from "../_types/IDataLoadRequest";
import { IDataHook } from "../_types/IDataHook";
/**
 * A data source that can be used to convert an asynchronous loader into a synchronous data retriever with loading state
 */
export declare class DataLoader<T> extends AbstractDataSource<T> {
    protected data: T;
    protected dirty: boolean;
    protected lastLoadTime: number;
    protected loader: () => Promise<T>;
    protected loading: boolean;
    protected exception: any;
    /**
     * Creates a new data loader instance, used to create a data source for async data getters
     * @param loader The function to load the data with
     * @param initial The initial value of the data
     * @param dirty Whether the initial value should be overwritten when any data is requested
     * @param loadImmediately Whether the data should already be fetched despite not having been requested yet
     */
    constructor(loader: () => Promise<T>, initial: T, dirty?: boolean, loadImmediately?: boolean);
    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook?: IDataHook): T;
    /**
     * Handles a data load request
     * @param request The request to handle
     */
    protected handleDataLoadRequest(request: IDataLoadRequest): void;
    /**
     * Fetches the data from the api
     */
    protected load(): Promise<void>;
    /**
     * Indicates that this data is no longer up to data and should be reloaded
     */
    markDirty(): void;
}
//# sourceMappingURL=DataLoader.d.ts.map