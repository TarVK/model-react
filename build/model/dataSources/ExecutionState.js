"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExecutionState = void 0;
const hookErrorHandler_1 = require("../../tools/hookErrorHandler");
const IDataLoadRequest_1 = require("../_types/IDataLoadRequest");
const AbstractDataSource_1 = require("./AbstractDataSource");
/**
 * A class to keep track of executing promises
 */
class ExecutionState extends AbstractDataSource_1.AbstractDataSource {
    constructor() {
        super(...arguments);
        this.executing = [];
    }
    /**
     * Retrieves whether any promises are executing
     * @param hook The hook to subscribe to changes, and store the meta loading state
     * @returns Whether any promises are still executing
     */
    get(hook) {
        var _a;
        super.addListener(hook);
        if (this.executing.length > 0) {
            if (IDataLoadRequest_1.isDataLoadRequest(hook)) {
                try {
                    (_a = hook.markIsLoading) === null || _a === void 0 ? void 0 : _a.call(hook);
                }
                catch (e) {
                    hookErrorHandler_1.handleHookError(e, this, hook, "markIsLoading");
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
    isLoading(hook) {
        super.addListener(hook);
        return this.executing.length > 0;
    }
    /**
     * Adds a promise for which to keep track of its execution state.
     * If an asynchronous function is added, it will automatically be invoked.
     * @param promise The promise to be added
     * @returns The promise itself, for chaining
     */
    add(promise) {
        const normalized = promise instanceof Function ? (promise = promise()) : promise;
        this.executing.push(normalized);
        promise.then(() => this.remove(normalized));
        if (this.executing.length == 1)
            this.callListeners();
        return normalized;
    }
    /**
     * Removes a promise which may have been aded before
     * @param promise The promise to be removed
     * @returns Whether the promise was present, and not already resolved
     */
    remove(promise) {
        const index = this.executing.indexOf(promise);
        if (index != -1) {
            this.executing.splice(index, 1);
            if (this.executing.length == 0)
                this.callListeners();
            return true;
        }
        return false;
    }
}
exports.ExecutionState = ExecutionState;
//# sourceMappingURL=ExecutionState.js.map