"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractDataSource = void 0;
const IDataListener_1 = require("../_types/IDataListener");
const hookErrorHandler_1 = require("../../tools/hookErrorHandler");
class AbstractDataSource {
    constructor() {
        // Data listeners to notify when data has changed
        this.listeners = [];
    }
    /**
     * Adds a listener for this field
     * @param listener The listener to add
     */
    addListener(listener) {
        if (IDataListener_1.isDataListener(listener) && this.listeners.indexOf(listener) === -1) {
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
        listenersCopy.forEach(listener => {
            try {
                listener.call();
            }
            catch (e) {
                hookErrorHandler_1.handleHookError(e, this, listener, "onCall");
            }
        });
    }
}
exports.AbstractDataSource = AbstractDataSource;
//# sourceMappingURL=AbstractDataSource.js.map