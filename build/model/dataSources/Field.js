"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Field = void 0;
const AbstractDataSource_1 = require("./AbstractDataSource");
/**
 * A simple field class that can be used to store data that may change over time
 */
class Field extends AbstractDataSource_1.AbstractDataSource {
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
exports.Field = Field;
//# sourceMappingURL=Field.js.map