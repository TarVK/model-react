import { IDataLoadRequest } from "../_types/IDataLoadRequest";
import { IDataListener } from "../_types/IDataListener";
/**
 * Retrieves a hook that can be used to listen to data from data sources,
 * such that the component rerenders upon data changes.
 * It also returns a function to determine whether the data is still loading, or has errored.
 * @param options  Configuration options
 * @returns The data hook followed by contextual data
 */
export declare const useDataHook: ({ forceRefreshTime, debounce, onChange, }?: {
    /** The time such that if data is older, it will be refreshed */
    forceRefreshTime?: number | undefined;
    /** The number of milliseconds to debounce updates, -1 to forward changes synchronously, defaults to 0 */
    debounce?: number | undefined;
    /** Code to call when a data update occurred */
    onChange?: (() => void) | undefined;
}) => [IDataListener & IDataLoadRequest, {
    /** Retrieves whether any obtained data is currently loading */
    isLoading: () => boolean;
    /** Retrieves the exceptions that may have occurred while loading */
    getExceptions: () => any[];
}];
//# sourceMappingURL=useDataHook.d.ts.map