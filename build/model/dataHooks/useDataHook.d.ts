import { IDataLoadRequest } from "../_types/IDataLoadRequest";
import { IDataListener } from "../_types/IDataListener";
/**
 * Retrieves a hook that can be used to listen to data from data sources,
 * such that the component rerenders upon data changes.
 * It also returns a function to determine whether the data is still loading, or has errored.
 * @param forceRefreshTime The time such that if data is older, it will be refreshed
 * @returns The data hook followed by contextual data
 */
export declare const useDataHook: (forceRefreshTime?: number) => [IDataListener & IDataLoadRequest, {
    /** Retrieves whether any obtained daata is currently loading */
    isLoading: () => boolean;
    /** Retrieves the exceptions that may have occured while loading */
    getExceptions: () => any[];
}];
