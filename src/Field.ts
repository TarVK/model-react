import {BaseModel} from "./Model";

export class Field<T> {
    // The model that this field is for
    protected model: BaseModel & {$getListener: (field: Field<any>) => void};

    // The value of the field
    protected value: T;

    // A list of listener methods to alert when the value changes
    protected listeners: ((v: T) => void)[] = [];

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
    constructor(initialValue: T, model?: BaseModel) {
        // Assign either the passed model, or the model stored in the field class
        this.model = (model || Field.model) as any;

        // Set the initial value
        this.value = initialValue;
    }

    // Field methods
    /**
     * Sets the value of the field
     * @param value The new value
     */
    public set(value: T): void {
        this.value = value;
        this.callListeners();
    }

    /**
     * Calls all listeners to notify them of the new value of the field
     */
    public callListeners(): void {
        this.listeners.forEach(l => l(this.value));
    }

    /**
     * Retrieves the value of the field
     * @returns The value
     */
    public get(): T {
        this.model.$getListener(this);
        return this.value;
    }

    // Listener methods
    /**
     * Adds a listener that is called when the value changes
     * @param listener The listener to add
     */
    public addListener(listener: (v: T) => void): void {
        const index = this.listeners.indexOf(listener);
        if (index == -1) this.listeners.push(listener);
    }

    /**
     * Removes an earlier added listener
     * @param listener The listener to remove
     */
    public removeListener(listener: (v: T) => void): void {
        const index = this.listeners.indexOf(listener);
        if (index != -1) this.listeners.splice(index, 1);
    }

    // Static methods
    /**
     * The modal that the next field will be for
     */
    protected static model: BaseModel;

    /**
     * Sets the model that the next created field will be for
     * @param model The model to create the next field for
     */
    public static setModel(model: BaseModel): void {
        this.model = model;
    }
}
