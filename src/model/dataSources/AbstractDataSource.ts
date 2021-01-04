import {IDataSource} from "../_types/IDataSource";
import {IDataListener, isDataListener} from "../_types/IDataListener";
import {IDataHook} from "../_types/IDataHook";
import {handleHookError} from "../../tools/hookErrorHandler";

export abstract class AbstractDataSource<T> implements IDataSource<T> {
    // Data listeners to notify when data has changed
    protected listeners: IDataListener[] = [];

    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    public abstract get(hook: IDataHook): T;

    /**
     * Adds a listener for this field
     * @param listener The listener to add
     */
    protected addListener(listener?: any): void {
        if (isDataListener(listener) && this.listeners.indexOf(listener) === -1) {
            this.listeners.push(listener);
            listener.registerRemover(() => {
                const index = this.listeners.indexOf(listener);
                if (index !== -1) this.listeners.splice(index, 1);
            });
        }
    }

    /**
     * Signals all listeners that data has been altered
     */
    protected callListeners(): void {
        const listenersCopy = [...this.listeners];
        listenersCopy.forEach(listener => {
            try {
                listener.call();
            } catch (e) {
                handleHookError(e, this, listener, "onCall");
            }
        });
    }
}
