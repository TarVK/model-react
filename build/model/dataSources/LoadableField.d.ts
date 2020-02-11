import { IDataSource } from "../_types/IDataSource";
import { IDataRetriever } from "../_types/IDataRetriever";
import { IDataRetrieverParams } from "../_types/IDataRetrieverParams";
import { Field } from "./Field";
export declare class LoadableField<T> extends Field<T> implements IDataSource<T> {
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
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The value that's currently available
     */
    get(params?: IDataRetrieverParams): T;
    /**
     * Retrieves the data from the loader,
     * and desides whether it should overwrite the field value
     * @param params Data used to know whether to reload and to notify about state changes
     */
    protected updatevalue(params?: IDataRetrieverParams): void;
}
