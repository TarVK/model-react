import { IDataRetrieverParams } from "../model/_types/IDataRetrieverParams";
/**
 * Creates a function to use the async state of a
 * @param l The data hook to forward the state to
 * @param latest Whether to only retrieve the last added action
 * @returns A function that promises can be wrapped with to track their state, a function to reset the state (mainly errors), and all the results
 */
export declare function useActionState<T = void>(l: IDataRetrieverParams, latest?: false): [(action: Promise<T> | (() => Promise<T>), reset?: boolean) => Promise<T>, () => void, T[]];
/**
 * Creates a function to use the async state of a
 * @param l The data hook to forward the state to
 * @param latest Whether to only retrieve the last added action
 * @returns A function that promises can be wrapped with to track their state, a function to reset the state (mainly errors), and the last result
 */
export declare function useActionState<T = void>(l: IDataRetrieverParams, latest: true): [(action: Promise<T> | (() => Promise<T>), reset?: boolean) => Promise<T>, () => void, T | undefined];
