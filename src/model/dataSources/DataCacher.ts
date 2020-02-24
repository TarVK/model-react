import {AbstractDataSource} from "./AbstractDataSource";
import {IDataSource} from "../_types/IDataSource";
import {IDataRetrieverParams} from "../_types/IDataRetrieverParams";
import {isDataLoadRequest} from "../_types/IDataLoadRequest";

export class DataCacher<T> extends AbstractDataSource<T> implements IDataSource<T> {
    // The source of the data
    protected source: (params: IDataRetrieverParams, current: T | undefined) => T;

    // The function to remove the dependency hook
    protected dependencyRemovers: (() => void)[] = [];

    // The currently cached data
    protected cached: T;

    // Status variables
    protected loading: boolean = false;
    protected exceptions: any[];
    protected lastLoadTime: number = 0;

    /**
     * Creates a new data cache, used to reduce number of calls to complex data transformers
     * @param source The function to use to compute the value
     */
    constructor(
        source: (
            /** The data hook to forward the sources */
            params: IDataRetrieverParams,
            /** The currently cached value */
            current: T | undefined
        ) => T
    ) {
        super();
        this.source = source;
    }

    /**
     * Updates the data if there is no dependency yet, or if a newer freshTimestamp is supplied
     * @param params Data used to know whether to reload
     */
    protected updateIfRequired(params?: IDataRetrieverParams): void {
        // Make sure we don't have a dependency already, unless we want to force reload
        const refreshTimestamp =
            isDataLoadRequest(params) &&
            params.refreshData &&
            params.refreshTimestamp > this.lastLoadTime &&
            params.refreshTimestamp;
        if (this.dependencyRemovers.length !== 0 && !refreshTimestamp) return;

        // Remove the old dependency listeners if there are any
        this.dependencyRemovers.forEach(remove => remove());
        const dependencyRemoves = (this.dependencyRemovers = []);

        // Reset the state data
        this.exceptions = [];
        this.loading = false;
        this.lastLoadTime = Date.now();

        // If a change occurs, remove the previous dependency listener and call own listeners
        const onChange = () => {
            // Make sure this isn't an outdated dependency listener
            if (dependencyRemoves !== this.dependencyRemovers) return;

            // Remove the currently dependencies, allowing for reload
            this.dependencyRemovers.forEach(remove => remove());
            this.dependencyRemovers = [];

            // Inform our listeners
            this.callListeners();
        };

        // Retrieve the new value and setup the new listener
        this.cached = this.source(
            {
                refreshData: true,
                refreshTimestamp,
                call: onChange,
                markShouldRefresh: () => {
                    this.loading = true;
                },
                registerException: exception => {
                    this.exceptions.push(exception);
                },
                registerRemover: remover => {
                    dependencyRemoves.push(remover);
                },
            },
            this.cached
        );
    }

    /**
     * Forwards the state of the retriever being cached
     * @param params Data used to notify about state changes
     */
    protected forwardState(params?: IDataRetrieverParams): void {
        if (isDataLoadRequest(params)) {
            if (params.registerException)
                this.exceptions.forEach(exception => params.registerException(exception));
            if (this.loading && params.markShouldRefresh) params.markShouldRefresh();
        }
    }

    /**
     * Retrieves the data of a source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The data that's currently available
     */
    public get(params?: IDataRetrieverParams): T {
        super.addListener(params);
        this.updateIfRequired(params);
        this.forwardState(params);
        return this.cached;
    }
}
