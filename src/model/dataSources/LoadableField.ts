import {IDataSource} from "../_types/IDataSource";
import {IDataRetriever} from "../_types/IDataRetriever";
import {IDataRetrieverParams} from "../_types/IDataRetrieverParams";
import {Field} from "./Field";

const defaultUpdater = (newLoaded: any, previousLoaded: any, current: any) =>
    newLoaded === previousLoaded ? current : newLoaded;

export class LoadableField<T> extends Field<T> implements IDataSource<T> {
    // The previous data retrieved from the loader
    protected loader: IDataRetriever<T>;
    protected previousLoaded: T | undefined = undefined;

    // Retrieves the new value of this field
    protected updater: (newLoaded: T, previousLoaded: T | undefined, current: T) => T;

    /**
     * Creates a new field that synchronizes with a data loader.
     * @param loader The loader to get the data from
     * @param updater A function
     */
    constructor(
        loader: IDataRetriever<T>,
        updater: (
            newLoaded: T,
            previousLoaded: T | undefined,
            current: T
        ) => T = defaultUpdater
    ) {
        super(loader());
        this.loader = loader;
        this.updater = defaultUpdater;
    }

    /**
     * Retrieves the value of a source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The value that's currently available
     */
    public get(params?: IDataRetrieverParams): T {
        this.updatevalue(params);
        return super.get(params);
    }

    /**
     * Retrieves the data from the loader,
     * and desides whether it should overwrite the field value
     * @param params Data used to know whether to reload and to notify about state changes
     */
    protected updatevalue(params?: IDataRetrieverParams): void {
        const value = this.loader(params);
        this.value = this.updater(value, this.previousLoaded, this.value);
        this.previousLoaded = value;
    }
}
