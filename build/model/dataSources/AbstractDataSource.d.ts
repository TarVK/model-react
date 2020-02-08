import { IDataSource } from "../_types/IDataSource";
import { IDataListener } from "../_types/IDataListener";
import { IDataRetrieverParams } from "../_types/IDataRetrieverParams";
export declare abstract class AbstractDataSource<T> implements IDataSource<T> {
    protected listeners: IDataListener[];
    /**
     * Retrieves the value of a source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The value that's currently available
     */
    abstract get(params?: IDataRetrieverParams): T;
    /**
     * Adds a listener for this field
     * @param listener The listener to add
     */
    protected addListener(listener?: any): void;
    /**
     * Signals all listeners that data has been altered
     */
    protected callListeners(): void;
}
