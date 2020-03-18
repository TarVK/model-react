import {IDataRetriever} from "./IDataRetriever";

/**
 * A data source that can be listened to
 */
export type IDataSource<T> = {
    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    get: IDataRetriever<T>;
};
