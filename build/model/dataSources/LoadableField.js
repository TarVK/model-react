"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoadableField = void 0;
const Field_1 = require("./Field");
const defaultUpdater = (newLoaded, previousLoaded, current) => newLoaded === previousLoaded ? current : newLoaded;
/** A class to create fields that get their initial value from a data retriever */
class LoadableField extends Field_1.Field {
    /**
     * Creates a new field that synchronizes with a data loader.
     * @param loader The loader to get the data from
     * @param updater A function to determine the new value of the field
     */
    constructor(loader, updater = defaultUpdater) {
        super(loader());
        this.previousLoaded = undefined;
        this.loader = loader;
        this.updater = updater;
    }
    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook) {
        this.updateValue(hook);
        return super.get(hook);
    }
    /**
     * Retrieves the data from the loader,
     * and desides whether it should overwrite the field value
     * @param hook Data to hook into the meta state and to notify about state changes
     */
    updateValue(hook) {
        const value = this.loader(hook);
        this.value = this.updater(value, this.previousLoaded, this.value);
        this.previousLoaded = value;
    }
    /**
     * Retrieves whether the value has been altered compared to the retriever
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns Whether the value has been altered
     */
    isDirty(hook) {
        return this.get(hook) != this.previousLoaded;
    }
}
exports.LoadableField = LoadableField;
//# sourceMappingURL=LoadableField.js.map