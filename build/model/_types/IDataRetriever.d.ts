import { IDataRetrieverParams } from "./IDataRetrieverParams";
/**
 * Retrieves the data of a source
 * @param params Data used to know whether to reload and to notify about state changes
 * @returns The data that's currently available
 */
export declare type IDataRetriever<T> = (params?: IDataRetrieverParams) => T;
