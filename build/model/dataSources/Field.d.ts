import { IDataSource } from "../_types/IDataSource";
import { AbstractDataSource } from "./AbstractDataSource";
import { IDataRetrieverParams } from "../_types/IDataRetrieverParams";
export declare class Field<T> extends AbstractDataSource<T> implements IDataSource<T> {
    protected value: T;
    /**
     * Creates a new field
     * @param value The initial value of the field
     */
    constructor(value: T);
    /**
     * Retrieves the value of a source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The value that's currently available
     */
    get(params?: IDataRetrieverParams): T;
    /**
     * Sets the new value of the field
     * @param value The new value
     */
    set(value: T): void;
}
