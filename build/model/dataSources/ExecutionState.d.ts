import { IDataHook } from "../_types/IDataHook";
import { IDataSource } from "../_types/IDataSource";
import { AbstractDataSource } from "./AbstractDataSource";
/**
 * A class to keep track of executing promises
 */
export declare class ExecutionState extends AbstractDataSource<boolean> implements IDataSource<boolean> {
    protected executing: Promise<any>[];
    /**
     * Retrieves whether any promises are executing
     * @param hook The hook to subscribe to changes, and store the meta loading state
     * @returns Whether any promises are still executing
     */
    get(hook?: IDataHook): boolean;
    /**
     * Retrieves the same result as the `get` method,
     * except it doesn't pass the loading as meta state to the hook
     * @param hook The hook to subscribe to changes
     * @returns Whether any promises are executing
     */
    isLoading(hook?: IDataHook): boolean;
    /**
     * Adds a promise for which to keep track of its execution state.
     * If an asynchronous function is added, it will automatically be invoked.
     * @param promise The promise to be added
     * @returns The promise itself, for chaining
     */
    add<T>(promise: Promise<T> | (() => Promise<T>)): Promise<T>;
    /**
     * Removes a promise which may have been aded before
     * @param promise The promise to be removed
     * @returns Whether the promise was present, and not already resolved
     */
    remove(promise: Promise<any>): boolean;
}
//# sourceMappingURL=ExecutionState.d.ts.map