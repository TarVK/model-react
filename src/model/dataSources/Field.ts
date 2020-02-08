import {IDataSource} from "../_types/IDataSource";
import {AbstractDataSource} from "./AbstractDataSource";
import {IDataRetrieverParams} from "../_types/IDataRetrieverParams";

export class Field<T> extends AbstractDataSource<T> implements IDataSource<T> {
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
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The value that's currently available
     */
    public get(params?: IDataRetrieverParams): T {
        super.addListener(params);
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
