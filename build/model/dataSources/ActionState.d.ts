import { AbstractDataSource } from "./AbstractDataSource";
import { IDataSource } from "../_types/IDataSource";
import { IDataRetrieverParams } from "../_types/IDataRetrieverParams";
export declare class ActionState<T = void> extends AbstractDataSource<T[]> implements IDataSource<T[]> {
    protected actions: {
        result: T | undefined;
        promise: Promise<T>;
        exception: any;
        loading: boolean;
        threw: boolean;
    }[];
    /**
     * Creates a new action state instance, used to track the state of async actions/function calls
     */
    constructor();
    /**
     * Retrieves the results of the actions
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns All the action data
     */
    get(params?: IDataRetrieverParams): T[];
    /**
     * Retrieves the last added action
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The action data
     */
    getLatest(params?: IDataRetrieverParams): T | undefined;
    /**
     * Forwards the state of the retriever being cached
     * @param params Data used to notify about state changes
     */
    protected forwardState(params?: IDataRetrieverParams, last?: boolean): void;
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
