import {AbstractDataSource} from "./AbstractDataSource";
import {IDataSource} from "../_types/IDataSource";
import {isDataLoadRequest} from "../_types/IDataLoadRequest";
import {IDataRetrieverParams} from "../_types/IDataRetrieverParams";

export class ActionState<T = void> extends AbstractDataSource<T[]>
    implements IDataSource<T[]> {
    // The actions being tracked
    protected actions: {
        result: T | undefined;
        promise: Promise<T>;
        exception: any;
        loading: boolean;
        threw: boolean;
    }[] = [];

    /**
     * Creates a new action state instance, used to track the state of async actions/function calls
     */
    constructor() {
        super();
    }

    /**
     * Retrieves the results of the actions
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns All the action data
     */
    public get(params?: IDataRetrieverParams): T[] {
        super.addListener(params);
        this.forwardState(params);
        return this.actions.filter(({loading}) => !loading).map(({result}) => result);
    }

    /**
     * Retrieves the last added action
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The action data
     */
    public getLatest(params?: IDataRetrieverParams): T | undefined {
        super.addListener(params);
        this.forwardState(params, true);
        return this.actions.length && this.actions[this.actions.length - 1].result;
    }

    /**
     * Forwards the state of the retriever being cached
     * @param params Data used to notify about state changes
     */
    protected forwardState(params?: IDataRetrieverParams, last: boolean = false): void {
        if (isDataLoadRequest(params)) {
            const actions = last
                ? this.actions.slice(this.actions.length - 1)
                : this.actions;
            if (params.registerException)
                actions.forEach(
                    ({exception, threw}) => threw && params.registerException(exception)
                );
            if (params.markShouldRefresh && actions.find(({loading}) => loading))
                params.markShouldRefresh();
        }
    }

    // Managing the actions
    /**
     * Adds an action to be tracked
     * @param action The to be called and tracked, or just the result promise of the action
     * @param reset Whether to remove the old data
     * @returns The result of the action
     */
    public addAction(
        action: Promise<T> | (() => Promise<T>),
        reset: boolean = false
    ): Promise<T> {
        if (action instanceof Function) action = action();
        if (reset) this.actions = [];

        // Create a temporary result
        const data = {
            result: undefined,
            promise: action,
            threw: false,
            exception: undefined,
            loading: true,
        };
        this.actions.push(data);
        this.callListeners();

        // Make the result update when the the action resolves or rejects
        const actions = this.actions;
        action
            .then(res => {
                // Check if we didn't reset the actions
                if (actions == this.actions) {
                    data.loading = false;
                    data.result = res;
                    this.callListeners();
                }
            })
            .catch(err => {
                // Check if we didn't reset the actions
                if (actions == this.actions) {
                    data.loading = false;
                    data.threw = true;
                    data.exception = err;
                    this.callListeners();
                }
            });

        // Return the action itself for simple inline usage
        return action;
    }

    /**
     * Removes the results of previous actions
     */
    public reset(): void {
        this.actions = [];
        this.callListeners();
    }
}
