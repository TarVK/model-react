import {IDataLoadRequest} from "../_types/IDataLoadRequest";
import {IDataListener} from "../_types/IDataListener";
import {useState, useEffect, useRef} from "react";

/**
 * Retrieves a hook that can be used to listen to data from data sources,
 * such that the component rerenders upon data changes.
 * It also returns a function to determine whether the data is still loading, or has errored.
 * @param forceRefreshTime The time such that if data is older, it will be refreshed
 * @returns The data hook followed by contextual data
 */
export const useDataHook = (
    forceRefreshTime?: number
): [
    IDataListener & IDataLoadRequest,
    {
        /** Retrieves whether any obtained data is currently loading */
        isLoading: () => boolean;
        /** Retrieves the exceptions that may have occurred while loading */
        getExceptions: () => any[];
    }
] => {
    // A fake state in order to fore an update
    const [, update] = useState();

    // A variable to track whether any retrieved data is refreshing, and exceptions
    let isRefreshing: boolean = false;
    let exceptions: any[] = [];

    // A list of functions to call to remove the passed listener as a dependency
    const dependencyRemovers = useRef([] as (() => void)[]);

    // Remove all dependencies when the element is removed or rerendered
    dependencyRemovers.current.forEach(remove => remove());
    useEffect(() => () => dependencyRemovers.current.forEach(remove => remove()), []);
    return [
        // Return the listener which will force an update, and registers whether any data is refreshing
        {
            // Data listener fields
            call() {
                update({});
            },
            registerRemover(remover: () => void) {
                dependencyRemovers.current.push(remover);
            },

            // Data loading fields
            refreshData: true,
            markIsLoading() {
                isRefreshing = true;
            },
            registerException(exception: any) {
                exceptions.push(exception);
            },
            ...(forceRefreshTime !== undefined && {refreshTimestamp: forceRefreshTime}),
        },
        // Return the function that retrieves if any data is refreshing
        {isLoading: () => isRefreshing, getExceptions: () => exceptions},
    ];
};
