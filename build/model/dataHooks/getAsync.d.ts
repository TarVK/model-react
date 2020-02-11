import { IDataLoadRequest } from "../_types/IDataLoadRequest";
import { IDataListener } from "../_types/IDataListener";
/**
 * Transforms a normal data getter into a promise that resolves when the data is loaded
 * @param getter The getter function call, which applies the hook
 * @param forceRefreshTime The time such that if data is older, it will be refreshed
 * @returns A promise with the result after all data sources finished loading/refreshing
 */
export declare const getAsync: <T>(getter: (hook: IDataLoadRequest & IDataListener) => T, forceRefreshTime?: number) => Promise<T>;
