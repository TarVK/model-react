export type IDataLoadRequest = {
    /**
     * Whether data should be loaded if absent or outdated
     */
    readonly refreshData?: boolean;
    /**
     * The timestamp such that data was loaded before this timestamp, it will be force reloaded
     */
    readonly refreshTimestamp?: number;
    /**
     * Marks that the retrieved data is currently still loading asynchronously,
     * Should only be called synchronously.
     */
    readonly markIsLoading?: () => void;
    /**
     * A function to pass data retrieval exceptions to
     * @param exception An exception thrown when refreshing data
     */
    readonly registerException?: (error: any) => void;
};

/**
 * Checks whether the given data satisfies the data load request constraints
 * @param data The data to check
 * @returns Whether the data represents a data load request
 */
export const isDataLoadRequest = (data: any): data is IDataLoadRequest =>
    data &&
    (data.refreshData !== undefined ||
        data.registerException instanceof Function ||
        data.markIsLoading instanceof Function);
