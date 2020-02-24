import {IDataSource} from "../_types/IDataSource";
import {IDataListener, isDataListener} from "../_types/IDataListener";
import {IDataRetrieverParams} from "../_types/IDataRetrieverParams";

export abstract class AbstractDataSource<T> implements IDataSource<T> {
    // Data listeners to notify when data has changed
    protected listeners: IDataListener[] = [];

    /**
     * Retrieves the value of a source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The value that's currently available
     */
    public abstract get(params?: IDataRetrieverParams): T;

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
        listenersCopy.forEach(listener => listener.call());
    }
}
