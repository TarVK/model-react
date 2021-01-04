import {AbstractDataSource} from "./AbstractDataSource";
import {IDataHook} from "../_types/IDataHook";

/**
 * A simple field class that can be used to store data that may change over time
 */
export class Field<T> extends AbstractDataSource<T> {
    // The data stored by the field
    protected value: T;

    /**
     * Creates a new field
     * @param value The initial value of the field
     */
    constructor(value: T) {
        super();
        this.value = value;
    }

    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    public get(hook: IDataHook): T {
        super.addListener(hook);
        return this.value;
    }

    /**
     * Sets the new value of the field
     * @param value The new value
     */
    public set(value: T): void {
        this.value = value;
        this.callListeners();
    }
}
