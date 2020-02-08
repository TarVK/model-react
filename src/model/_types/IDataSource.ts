import {IDataRetriever} from "./IDataRetriever";

/**
 * A data source that can be listened to
 */
export type IDataSource<T> = {
    /**
     * Retrieves the data of a source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The data that's currently available
     */
    get: IDataRetriever<T>;
};
