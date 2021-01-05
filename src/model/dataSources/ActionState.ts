import {AbstractDataSource} from "./AbstractDataSource";
import {IDataSource} from "../_types/IDataSource";
import {isDataLoadRequest} from "../_types/IDataLoadRequest";
import {IDataHook} from "../_types/IDataHook";
import {handleHookError} from "../../tools/hookErrorHandler";

/**
 * A class to keep track of the result and states of promises/actions
 */
export class ActionState<T = void>
    extends AbstractDataSource<T[]>
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
     * Creates a new action state, used to track the state of async actions/function calls
     */
    constructor() {
        super();
    }

    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    public get(hook?: IDataHook): T[] {
        super.addListener(hook);
        this.forwardState(hook);
        return this.actions
            .filter(({loading}) => !loading)
            .map(({result}) => result) as T[];
    }

    /**
     * Retrieves the last added action
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The action data
     */
    public getLatest(hook?: IDataHook): T | undefined {
        super.addListener(hook);
        this.forwardState(hook, true);
        return this.actions.length !== 0
            ? this.actions[this.actions.length - 1].result
            : undefined;
    }

    /**
     * Forwards the state of the retriever being cached
     * @param hook Data to hook into the meta state and to notify about state changes
     */
    protected forwardState(hook?: IDataHook, last: boolean = false): void {
        if (isDataLoadRequest(hook)) {
            const actions = last
                ? this.actions.slice(this.actions.length - 1)
                : this.actions;
            if (hook.registerException)
                actions.forEach(({exception, threw}) => {
                    if (threw) {
                        try {
                            hook.registerException?.(exception);
                        } catch (e) {
                            handleHookError(e, this, hook, "registerException");
                        }
                    }
                });
            if (hook.markIsLoading && actions.find(({loading}) => loading))
                try {
                    hook.markIsLoading();
                } catch (e) {
                    handleHookError(e, this, hook, "markIsLoading");
                }
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
            result: undefined as T | undefined,
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
