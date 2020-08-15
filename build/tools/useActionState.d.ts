import { IDataHook } from "../model/_types/IDataHook";
/**
 * Creates a function to use the async state of a
 * @param hook The data hook to forward the state to
 * @param latest Whether to only retrieve the last added action
 * @returns A function that promises can be wrapped with to track their state, a function to reset the state (mainly errors), and all the results
 */
export declare function useActionState<T = void>(hook: IDataHook, latest?: false): [(
/** The action to add, whose value will be returned */
action: Promise<T> | (() => Promise<T>), 
/** Whether to reset the state of previously added actions */
reset?: boolean) => Promise<T>, () => void, T[]];
/**
 * Creates a function to use the async state of a
 * @param hook The data hook to forward the state to
 * @param latest Whether to only retrieve the last added action
 * @returns A function that promises can be wrapped with to track their state, a function to reset the state (mainly errors), and the last result
 */
export declare function useActionState<T = void>(hook: IDataHook, latest: true): [(
/** The action to add, whose value will be returned */
action: Promise<T> | (() => Promise<T>), 
/** Whether to reset the state of previously added actions */
reset?: boolean) => Promise<T>, () => void, T | undefined];
//# sourceMappingURL=useActionState.d.ts.map