import {IDataRetriever} from "../_types/IDataRetriever";
import {IDataHook} from "../_types/IDataHook";
import {Field} from "./Field";

const defaultUpdater = (newLoaded: any, previousLoaded: any, current: any) =>
    newLoaded === previousLoaded ? current : newLoaded;

/** A class to create fields that get their initial value from a data retriever */
export class LoadableField<T> extends Field<T> {
    // The previous data retrieved from the loader
    protected loader: IDataRetriever<T>;
    protected previousLoaded: T | undefined = undefined;

    // Retrieves the new value of this field
    protected updater: (newLoaded: T, previousLoaded: T | undefined, current: T) => T;

    /**
     * Creates a new field that synchronizes with a data loader.
     * @param loader The loader to get the data from
     * @param updater A function to determine the new value of the field
     */
    constructor(
        loader: IDataRetriever<T>,
        updater: (
            /** The latest value of the loader */
            newLoaded: T,
            /** The previous value of the loader */
            previousLoaded: T | undefined,
            /** The current value of the field */
            current: T
        ) => T = defaultUpdater
    ) {
        super(loader());
        this.loader = loader;
        this.updater = updater;
    }

    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    public get(hook?: IDataHook): T {
        this.updateValue(hook);
        return super.get(hook);
    }

    /**
     * Retrieves the data from the loader,
     * and desides whether it should overwrite the field value
     * @param hook Data to hook into the meta state and to notify about state changes
     */
    protected updateValue(hook?: IDataHook): void {
        const value = this.loader(hook);
        this.value = this.updater(value, this.previousLoaded, this.value);
        this.previousLoaded = value;
    }

    /**
     * Retrieves whether the value has been altered compared to the retriever
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns Whether the value has been altered
     */
    public isDirty(hook?: IDataHook): boolean {
        return this.get(hook) != this.previousLoaded;
    }
}
