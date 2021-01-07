import { AbstractDataSource } from "./AbstractDataSource";
/**
 * A simple field class that can be used to store data that may change over time
 */
export class Field extends AbstractDataSource {
    /**
     * Creates a new field
     * @param value The initial value of the field
     */
    constructor(value) {
        super();
        this.value = value;
    }
    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook) {
        super.addListener(hook);
        return this.value;
    }
    /**
     * Sets the new value of the field
     * @param value The new value
     */
    set(value) {
        this.value = value;
        this.callListeners();
    }
}
//# sourceMappingURL=Field.js.map