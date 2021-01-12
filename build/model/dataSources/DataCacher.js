"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataCacher = void 0;
const AbstractDataSource_1 = require("./AbstractDataSource");
const IDataLoadRequest_1 = require("../_types/IDataLoadRequest");
const hookErrorHandler_1 = require("../../tools/hookErrorHandler");
/**
 * A class to create a data combiner, and cache the results
 */
class DataCacher extends AbstractDataSource_1.AbstractDataSource {
    /**
     * Creates a new data cache, used to reduce number of calls to complex data transformers
     * @param source The function to use to compute the value
     * @param config Any additional optional configuration
     */
    constructor(source, { onUpdate, } = {}) {
        super();
        // The function to remove the dependency hook
        this.dependencyRemovers = [];
        // Status variables
        this.loading = false;
        this.lastLoadTime = 0;
        this.isDirty = true;
        this.source = source;
        this.onUpdate = onUpdate;
    }
    /**
     * Updates the data if there is no dependency yet, or if a newer freshTimestamp is supplied
     * @param hook Data to know whether to reload
     */
    updateIfRequired(params) {
        var _a;
        // Make sure we don't have a dependency already, unless we want to force reload
        const refreshTimestamp = IDataLoadRequest_1.isDataLoadRequest(params) && params.refreshData
            ? params.refreshTimestamp !== undefined &&
                params.refreshTimestamp > this.lastLoadTime
                ? params.refreshTimestamp
                : undefined
            : undefined;
        if (!(this.isDirty || refreshTimestamp))
            return;
        // Remove the old dependency listeners if there are any
        this.dependencyRemovers.forEach(remove => remove());
        const dependencyRemoves = (this.dependencyRemovers = []);
        // Reset the state data
        this.exceptions = [];
        this.loading = false;
        this.lastLoadTime = Date.now();
        // If a change occurs, remove the previous dependency listener and call own listeners
        const onChange = () => {
            // Make sure this isn't an outdated dependency listener
            if (dependencyRemoves !== this.dependencyRemovers)
                return;
            // Remove the currently dependencies, allowing for reload
            this.dependencyRemovers.forEach(remove => remove());
            this.dependencyRemovers = [];
            // Inform our listeners
            this.isDirty = true;
            this.callListeners();
        };
        // Retrieve the new value and setup the new listener
        const prev = this.cached;
        this.isDirty = false;
        this.cached = this.source({
            refreshData: true,
            refreshTimestamp,
            call: onChange,
            markIsLoading: () => {
                this.loading = true;
            },
            registerException: exception => {
                this.exceptions.push(exception);
            },
            registerRemover: remover => {
                dependencyRemoves.push(remover);
            },
        }, prev);
        // Perform any side effects
        (_a = this.onUpdate) === null || _a === void 0 ? void 0 : _a.call(this, this.cached, prev);
    }
    /**
     * Forwards the state of the retriever being cached
     * @param hook Data used to notify about state changes
     */
    forwardState(hook) {
        if (IDataLoadRequest_1.isDataLoadRequest(hook)) {
            if (hook.registerException)
                this.exceptions.forEach(exception => {
                    var _a;
                    try {
                        (_a = hook.registerException) === null || _a === void 0 ? void 0 : _a.call(hook, exception);
                    }
                    catch (e) {
                        hookErrorHandler_1.handleHookError(e, this, hook, "registerException");
                    }
                });
            if (this.loading && hook.markIsLoading)
                try {
                    hook.markIsLoading();
                }
                catch (e) {
                    hookErrorHandler_1.handleHookError(e, this, hook, "markIsLoading");
                }
        }
    }
    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook) {
        super.addListener(hook);
        this.updateIfRequired(hook);
        this.forwardState(hook);
        return this.cached;
    }
    /**
     * Destroys any potential data hook, making sure there are no memory leaks.
     * Note that this hook would clean itself up when being called anyhow, so calling destroy is not strictly necessary,
     * but it prevents potential build up of huge listener arrays that could cause a lag spike when initially called.
     */
    destroy() {
        this.dependencyRemovers.forEach(remove => remove());
        this.dependencyRemovers = [];
    }
}
exports.DataCacher = DataCacher;
//# sourceMappingURL=DataCacher.js.map