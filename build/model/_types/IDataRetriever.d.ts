import { IDataHook } from "./IDataHook";
/**
 * Retrieves the value of a source
 * @param hook Data to hook into the meta state and to notify about state changes
 * @returns The value that's currently available
 */
export declare type IDataRetriever<T> = (hook: IDataHook) => T;
