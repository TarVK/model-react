import { IDataLoadRequest } from "../_types/IDataLoadRequest";
import { IDataListener } from "../_types/IDataListener";
/**
 * Transforms a normal data getter into a promise that resolves when the data is loaded
 * @param getter The getter function call, which applies the hook
 * @param refreshTimestamp The oldest allowed time for data to have been loaded without requiring a refresh
 * @returns A promise with the result after all data sources finished loading/refreshing
 */
export declare const getAsync: <T>(getter: (hook: IDataLoadRequest & IDataListener) => T, refreshTimestamp?: number) => Promise<T>;
