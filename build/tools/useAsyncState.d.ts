import { IDataRetrieverParams } from "../model/_types/IDataRetrieverParams";
/**
 * Creates a function to use the async state of a
 * @param l The data hook to forward the state to
 * @returns A function that promises can be wrapped with to track their state, and a function to reset the state (mainly errors)
 */
export declare const useAsyncState: (l: IDataRetrieverParams) => [(promise: Promise<any>) => void, () => void];
