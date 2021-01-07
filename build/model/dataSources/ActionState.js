import { AbstractDataSource } from "./AbstractDataSource";
import { isDataLoadRequest } from "../_types/IDataLoadRequest";
import { handleHookError } from "../../tools/hookErrorHandler";
/**
 * A class to keep track of the result and states of promises/actions
 */
export class ActionState extends AbstractDataSource {
    /**
     * Creates a new action state, used to track the state of async actions/function calls
     */
    constructor() {
        super();
        // The actions being tracked
        this.actions = [];
    }
    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook) {
        super.addListener(hook);
        this.forwardState(hook);
        return this.actions
            .filter(({ loading }) => !loading)
            .map(({ result }) => result);
    }
    /**
     * Retrieves the last added action
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The action data
     */
    getLatest(hook) {
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
    forwardState(hook, last = false) {
        if (isDataLoadRequest(hook)) {
            const actions = last
                ? this.actions.slice(this.actions.length - 1)
                : this.actions;
            if (hook.registerException)
                actions.forEach(({ exception, threw }) => {
                    var _a;
                    if (threw) {
                        try {
                            (_a = hook.registerException) === null || _a === void 0 ? void 0 : _a.call(hook, exception);
                        }
                        catch (e) {
                            handleHookError(e, this, hook, "registerException");
                        }
                    }
                });
            if (hook.markIsLoading && actions.find(({ loading }) => loading))
                try {
                    hook.markIsLoading();
                }
                catch (e) {
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
    addAction(action, reset = false) {
        if (action instanceof Function)
            action = action();
        if (reset)
            this.actions = [];
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
    reset() {
        this.actions = [];
        this.callListeners();
    }
}
//# sourceMappingURL=ActionState.js.map