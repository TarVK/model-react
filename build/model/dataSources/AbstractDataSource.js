import { isDataListener } from "../_types/IDataListener";
import { handleHookError } from "../../tools/hookErrorHandler";
export class AbstractDataSource {
    constructor() {
        // Data listeners to notify when data has changed
        this.listeners = [];
    }
    /**
     * Adds a listener for this field
     * @param listener The listener to add
     */
    addListener(listener) {
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
        listenersCopy.forEach(listener => {
            try {
                listener.call();
            }
            catch (e) {
                handleHookError(e, this, listener, "onCall");
            }
        });
    }
}
//# sourceMappingURL=AbstractDataSource.js.map