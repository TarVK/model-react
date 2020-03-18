import { IDataRetriever } from "../_types/IDataRetriever";
import { IDataHook } from "../_types/IDataHook";
import { Field } from "./Field";
export declare class LoadableField<T> extends Field<T> {
    protected loader: IDataRetriever<T>;
    protected previousLoaded: T | undefined;
    protected updater: (newLoaded: T, previousLoaded: T | undefined, current: T) => T;
    /**
     * Creates a new field that synchronizes with a data loader.
     * @param loader The loader to get the data from
     * @param updater A function to determine the new value of the field
     */
    constructor(loader: IDataRetriever<T>, updater?: (
    /** The latest value of the loader */
    newLoaded: T, 
    /** The previous value of the loader */
    previousLoaded: T | undefined, 
    /** The current value of the field */
    current: T) => T);
    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get(hook: IDataHook): T;
    /**
     * Retrieves the data from the loader,
     * and desides whether it should overwrite the field value
     * @param hook Data to hook into the meta state and to notify about state changes
     */
    protected updateValue(hook: IDataHook): void;
}
