import { AbstractDataSource } from "./AbstractDataSource";
import { IDataSource } from "../_types/IDataSource";
import { IDataHook } from "../_types/IDataHook";
export declare class ActionState<T = void> extends AbstractDataSource<T[]> implements IDataSource<T[]> {
    protected actions: {
        result: T | undefined;
        promise: Promise<T>;
        exception: any;
        loading: boolean;
        threw: boolean;
    }[];
    /**
     * Creates a new action state, used to track the state of async actions/function calls
     */
    constructor();
    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook: IDataHook): T[];
    /**
     * Retrieves the last added action
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The action data
     */
    getLatest(hook: IDataHook): T | undefined;
    /**
     * Forwards the state of the retriever being cached
     * @param hook Data to hook into the meta state and to notify about state changes
     */
    protected forwardState(hook: IDataHook, last?: boolean): void;
    /**
     * Adds an action to be tracked
     * @param action The to be called and tracked, or just the result promise of the action
     * @param reset Whether to remove the old data
     * @returns The result of the action
     */
    addAction(action: Promise<T> | (() => Promise<T>), reset?: boolean): Promise<T>;
    /**
     * Removes the results of previous actions
     */
    reset(): void;
}
//# sourceMappingURL=ActionState.d.ts.map