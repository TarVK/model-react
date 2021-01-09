import {handleHookError} from "../../tools/hookErrorHandler";
import {IDataHook} from "../_types/IDataHook";
import {isDataLoadRequest} from "../_types/IDataLoadRequest";
import {IDataSource} from "../_types/IDataSource";
import {AbstractDataSource} from "./AbstractDataSource";

/**
 * A class to keep track of executing promises
 */
export class ExecutionState
    extends AbstractDataSource<boolean>
    implements IDataSource<boolean> {
    protected executing: Promise<any>[] = [];

    /**
     * Retrieves whether any promises are executing
     * @param hook The hook to subscribe to changes, and store the meta loading state
     * @returns Whether any promises are still executing
     */
    public get(hook?: IDataHook): boolean {
        super.addListener(hook);
        if (this.executing.length > 0) {
            if (isDataLoadRequest(hook)) {
                try {
                    hook.markIsLoading?.();
                } catch (e) {
                    handleHookError(e, this, hook, "markIsLoading");
                }
            }
            return true;
        }
        return false;
    }

    /**
     * Retrieves the same result as the `get` method,
     * except it doesn't pass the loading as meta state to the hook
     * @param hook The hook to subscribe to changes
     * @returns Whether any promises are executing
     */
    public isLoading(hook?: IDataHook): boolean {
        super.addListener(hook);
        return this.executing.length > 0;
    }

    /**
     * Adds a promise for which to keep track of its execution state.
     * If an asynchronous function is added, it will automatically be invoked.
     * @param promise The promise to be added
     * @returns The promise itself, for chaining
     */
    public add<T>(promise: Promise<T> | (() => Promise<T>)): Promise<T> {
        const normalized = promise instanceof Function ? (promise = promise()) : promise;

        this.executing.push(normalized);
        promise.then(() => this.remove(normalized));
        if (this.executing.length == 1) this.callListeners();

        return normalized;
    }

    /**
     * Removes a promise which may have been aded before
     * @param promise The promise to be removed
     * @returns Whether the promise was present, and not already resolved
     */
    public remove(promise: Promise<any>): boolean {
        const index = this.executing.indexOf(promise);
        if (index != -1) {
            this.executing.splice(index, 1);
            if (this.executing.length == 0) this.callListeners();
            return true;
        }
        return false;
    }
}
