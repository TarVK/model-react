import { AbstractDataSource } from "./AbstractDataSource";
import { IDataSource } from "../_types/IDataSource";
import { IDataLoadRequest } from "../_types/IDataLoadRequest";
import { IDataRetrieverParams } from "../_types/IDataRetrieverParams";
export declare class DataLoader<T> extends AbstractDataSource<T> implements IDataSource<T> {
    protected data: T;
    protected dirty: boolean;
    protected lastLoadTime: number;
    protected loader: () => Promise<T>;
    protected loading: boolean;
    protected exception: any;
    /**
     * Creates a new data loader instance
     * @param loader The function to load the data with
     * @param initial The initial value of the data
     * @param dirty Whether the initial value should be overwritten when any data is request
     * @param loadImmediately Whether the data should already be fetched despite not having been requested yet
     */
    constructor(loader: () => Promise<T>, initial: T, dirty?: boolean, loadImmediately?: boolean);
    /**
     * Retrieves the data of a source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The data that's currently available
     */
    get(params?: IDataRetrieverParams): T;
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
     * Indicates that this data is no longer up to data and should be checked
     */
    markDirty(): void;
}
