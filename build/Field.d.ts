import { BaseModel } from "./Model";
export declare class Field<T> {
    protected model: BaseModel & {
        $getListener: (field: Field<any>) => void;
    };
    protected value: T;
    protected listeners: ((v: T) => void)[];
    /**
     * Creates a field for a model
     * @param initialValue The initial value for the field
     * @param model The model that this field is for
     */
    constructor(initialValue: T, model: BaseModel);
    /**
     * Creates a field for a model
     * @param initialValue The initial value for the field
     */
    constructor(initialValue: T);
    /**
     * Sets the value of the field
     * @param value The new value
     */
    set(value: T): void;
    /**
     * Calls all listeners to notify them of the new value of the field
     */
    callListeners(): void;
    /**
     * Retrieves the value of the field
     * @returns The value
     */
    get(): T;
    /**
     * Adds a listener that is called when the value changes
     * @param listener The listener to add
     */
    addListener(listener: (v: T) => void): void;
    /**
     * Removes an earlier added listener
     * @param listener The listener to remove
     */
    removeListener(listener: (v: T) => void): void;
    /**
     * The modal that the next field will be for
     */
    protected static model: BaseModel;
    /**
     * Sets the model that the next created field will be for
     * @param model The model to create the next field for
     */
    static setModel(model: BaseModel): void;
}
