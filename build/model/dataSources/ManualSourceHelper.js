import { handleHookError } from "../../tools/hookErrorHandler";
import { isDataListener } from "../_types/IDataListener";
import { isDataLoadRequest } from "../_types/IDataLoadRequest";
/**
 * A class to help with creating advanced manual data sources
 */
export class ManualSourceHelper {
    /**
     * Creates a new manual source helper
     * @param onLoadRequest The callback to make when a hook requests a data (re)load
     */
    constructor(onLoadRequest) {
        // Data listeners to notify when data has changed
        this.listeners = [];
        // Exceptions to pass to new listeners
        this.exceptions = [];
        // Whether to pass the loading state to new listeners
        this.loading = false;
        this.onLoadRequest = onLoadRequest;
    }
    /**
     * Sets any exceptions that may have occurred in the source
     * @param exceptions The exceptions to pass to listeners
     * @param suppressUpdate Whether to suppress calling the listeners
     */
    setExceptions(exceptions, suppressUpdate = this.exceptions == exceptions) {
        this.exceptions = exceptions;
        if (!suppressUpdate)
            this.callListeners();
    }
    /**
     * Retrieves the exceptions that the source currently indicate to have
     * @returns The exceptions
     */
    getExceptions() {
        return this.exceptions;
    }
    /**
     * Sets whether this source is loading
     * @param loading Whether the source is loading
     * @param suppressUpdate Whether to suppress calling the listeners
     */
    setLoading(loading, suppressUpdate = this.loading == loading) {
        this.loading = loading;
        if (!suppressUpdate)
            this.callListeners();
    }
    /**
     * Retrieves whether the source currently indicates to be loading
     * @returns Whether the source indicates to be loading
     */
    getLoading() {
        return this.loading;
    }
    /**
     * Adds a listener for this field
     * @param listener The listener to add
     */
    addListener(listener) {
        if (isDataLoadRequest(listener)) {
            if (listener.markIsLoading && this.loading)
                try {
                    listener.markIsLoading();
                }
                catch (e) {
                    handleHookError(e, this, listener, "markIsLoading");
                }
            if (listener.registerException)
                this.exceptions.forEach(ex => {
                    var _a;
                    try {
                        (_a = listener.registerException) === null || _a === void 0 ? void 0 : _a.call(listener, ex);
                    }
                    catch (e) {
                        handleHookError(e, this, listener, "registerException");
                    }
                });
            if (listener.refreshData && this.onLoadRequest)
                this.onLoadRequest(listener.refreshTimestamp);
        }
        if (isDataListener(listener) && this.listeners.indexOf(listener) === -1) {
            this.listeners.push(listener);
            listener.registerRemover(() => {
                const index = this.listeners.indexOf(listener);
                if (index !== -1)
                    this.listeners.splice(index, 1);
            });
        }
    }
    /**
     * Signals all listeners that data has been altered
     */
    callListeners() {
        const listenersCopy = [...this.listeners];
        listenersCopy.forEach(listener => listener.call());
    }
}
//# sourceMappingURL=ManualSourceHelper.js.map