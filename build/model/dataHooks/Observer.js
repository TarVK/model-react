"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Observer = void 0;
const hookErrorHandler_1 = require("../../tools/hookErrorHandler");
/**
 * A data hook to listen to a stream of changes
 */
class Observer {
    /**
     * Creates a new observer
     * @param getter The target data to observe
     * @param options Any additional configuration options
     */
    constructor(getter, { init = false, debounce = 0, refreshData = true, } = {}) {
        // Listener variables
        this.listeners = [];
        // State variables
        this.isDestroyed = false;
        this.isDirty = true;
        // Dependency management variables
        this.dependencyRemovers = [];
        this.exceptions = [];
        this.isLoading = false;
        // Variables to keep track of the previous value
        this.initialized = false;
        this.getter = "get" in getter ? getter.get.bind(getter) : getter;
        this.debounce = debounce;
        this.refreshData = refreshData;
        if (init)
            this.getData(true);
    }
    /**
     * Gets the data and sets up the listener for the target
     * @param force Whether to retrieve the data even without listeners
     */
    getData(force) {
        if (this.isDestroyed || (this.listeners.length == 0 && !force))
            return;
        this.isLoading = false;
        this.exceptions = [];
        this.value = this.getter({
            call: () => {
                this.removeDependencies();
                this.isDirty = true;
                // Setup the listener again, and call all our listeners
                this.getData(force);
                this.callListeners();
            },
            registerRemover: (remover) => {
                this.dependencyRemovers.push(remover);
            },
            markIsLoading: () => {
                this.isLoading = true;
            },
            refreshData: this.refreshData,
            registerException: (exception) => {
                this.exceptions.push(exception);
            },
        });
        if (!this.initialized) {
            this.previousValue = this.value;
            this.initialized = true;
        }
        this.isDirty = false;
    }
    /**
     * Gets rid of all listeners
     */
    removeDependencies() {
        this.dependencyRemovers.forEach(remove => remove());
        this.dependencyRemovers = [];
    }
    /**
     * Destroys the observer, preventing it from listening to the target
     */
    destroy() {
        this.isDestroyed = true;
        this.removeDependencies();
        this.isDirty = false;
    }
    // Listener management
    /**
     * Calls all the listeners with the loaded data
     */
    callListeners() {
        if (this.isDestroyed)
            return;
        if (this.debounce == -1) {
            const meta = { isLoading: this.isLoading, exceptions: this.exceptions };
            this.listeners.forEach(listener => {
                try {
                    listener(this.value, meta, this.previousValue);
                }
                catch (e) {
                    hookErrorHandler_1.handleHookError(e, this, undefined, "onCall");
                }
            });
            this.previousValue = this.value;
        }
        // If the call should be debounced, only add a timer if none is present already
        else if (!this.callListenersTimeout) {
            this.callListenersTimeout = setTimeout(() => {
                this.callListenersTimeout = undefined;
                const meta = { isLoading: this.isLoading, exceptions: this.exceptions };
                this.listeners.forEach(listener => {
                    try {
                        listener(this.value, meta, this.previousValue);
                    }
                    catch (e) {
                        hookErrorHandler_1.handleHookError(e, this, undefined, "onCall");
                    }
                });
                this.previousValue = this.value;
            }, this.debounce);
        }
    }
    /**
     * Adds a listener to the observer
     * @param listener The listener to add
     * @param initCall Whether to call the listener with the initial value
     * @returns This, for method chaining
     */
    listen(listener, initCall) {
        if (this.isDestroyed)
            throw Error("Listeners can't be added once the observer is destroyed");
        this.listeners.push(listener);
        if (this.isDirty)
            this.getData();
        if (initCall) {
            listener(this.value, {
                isLoading: this.isLoading,
                exceptions: this.exceptions,
            }, this.previousValue);
        }
        return this;
    }
    /**
     * Removes a listener from the observer
     * @param listener The listener to remove
     * @returns Whether the listener was removed
     */
    removeListener(listener) {
        if (this.isDestroyed)
            throw Error("Listeners can't be removed once the observer is destroyed");
        const index = this.listeners.indexOf(listener);
        if (index != -1) {
            this.listeners.splice(index, 1);
            return true;
        }
        return false;
    }
}
exports.Observer = Observer;
//# sourceMappingURL=Observer.js.map