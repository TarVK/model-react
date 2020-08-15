import { IDataSource } from "../_types/IDataSource";
import { IDataListener } from "../_types/IDataListener";
import { IDataHook } from "../_types/IDataHook";
export declare abstract class AbstractDataSource<T> implements IDataSource<T> {
    protected listeners: IDataListener[];
    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    abstract get(hook: IDataHook): T;
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
//# sourceMappingURL=AbstractDataSource.d.ts.map