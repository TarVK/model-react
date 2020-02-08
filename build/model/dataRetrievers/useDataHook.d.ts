import { IDataLoadRequest } from "../_types/IDataLoadRequest";
import { IDataListener } from "../_types/IDataListener";
/**
 * Retrieves a hook that can be used to listen to data from data sources, such that the component rerenders upon data changes.
 * As well a function to determine whether the data is still loading
 * @param forceRefreshTime The time such that if data is loader, it will be refreshed
 * @returns The data hook followed by contextual data
 */
export declare const useDataHook: (refreshTime?: number) => [IDataListener & IDataLoadRequest, {
    isLoading: () => boolean;
    getExceptions: () => any[];
}];
