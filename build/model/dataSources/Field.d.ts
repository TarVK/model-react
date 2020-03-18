import { AbstractDataSource } from "./AbstractDataSource";
import { IDataHook } from "../_types/IDataHook";
export declare class Field<T> extends AbstractDataSource<T> {
    protected value: T;
    /**
     * Creates a new field
     * @param value The initial value of the field
     */
    constructor(value: T);
    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook: IDataHook): T;
    /**
     * Sets the new value of the field
     * @param value The new value
     */
    set(value: T): void;
}
