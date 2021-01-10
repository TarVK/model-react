import {AbstractDataSource} from "./AbstractDataSource";
import {IDataLoadRequest, isDataLoadRequest} from "../_types/IDataLoadRequest";
import {IDataHook} from "../_types/IDataHook";
import {handleHookError} from "../../tools/hookErrorHandler";

/**
 * A data source that can be used to convert an asynchronous loader into a synchronous data retriever with loading state
 */
export class DataLoader<T, K extends T = T> extends AbstractDataSource<T> {
    // The currently loaded data
    protected data: T;

    // Whether the current data is obsolete
    protected dirty: boolean;
    // The timestamp at which the loader was last called
    protected lastLoadTime: number = 0;

    // The data loading function
    protected loader: () => Promise<T>;
    // Whether the loader is currently loading data
    protected loading: boolean = false;

    // Any exception that might have occurred when loading data
    protected exception: any;

    /**
     * Creates a new data loader instance, used to create a data source for async data getters
     * @param loader The function to load the data with
     * @param initial The initial value of the data
     * @param dirty Whether the initial value should be overwritten when any data is requested
     * @param loadImmediately Whether the data should already be fetched despite not having been requested yet
     */
    constructor(
        loader: () => Promise<K>,
        initial: T,
        dirty: boolean = true,
        loadImmediately: boolean = false
    ) {
        super();
        this.loader = loader;
        this.data = initial;
        this.dirty = dirty;
        if (loadImmediately) this.load();
    }

    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    public get(hook?: IDataHook): T {
        super.addListener(hook);

        // Handle any load request
        if (isDataLoadRequest(hook)) this.handleDataLoadRequest(hook);

        // Return the current data
        return this.data;
    }

    /**
     * Handles a data load request
     * @param request The request to handle
     */
    protected handleDataLoadRequest(request: IDataLoadRequest): void {
        // Check whether we should refresh the data
        const shouldRefresh =
            this.dirty ||
            (request.refreshTimestamp && request.refreshTimestamp > this.lastLoadTime);
        if (shouldRefresh && request.refreshData) this.load();
        if (this.loading && request.markIsLoading)
            try {
                request.markIsLoading();
            } catch (e) {
                handleHookError(e, this, request, "markIsLoading");
            }

        // Forward exceptions
        if (this.exception && request.registerException)
            try {
                request.registerException(this.exception);
            } catch (e) {
                handleHookError(e, this, request, "registerException");
            }
    }

    /**
     * Fetches the data from the api
     */
    protected async load(): Promise<void> {
        if (!this.loading) {
            // Update loading indicators
            this.loading = true;
            this.lastLoadTime = Date.now();

            // Call listeners so they know we're loading
            this.callListeners();

            // Load the new data
            try {
                this.data = await this.loader();
                this.exception = undefined;
            } catch (e) {
                this.exception = e;
            }

            // Update indicators
            this.loading = false;
            this.dirty = false;

            // Call listeners to they know we're done loading
            this.callListeners();
        }
    }

    /**
     * Indicates that this data is no longer up to data and should be reloaded
     */
    public markDirty(): void {
        this.dirty = true;
        this.callListeners();
    }
}
