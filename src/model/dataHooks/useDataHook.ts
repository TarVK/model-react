import {IDataLoadRequest} from "../_types/IDataLoadRequest";
import {IDataListener} from "../_types/IDataListener";
import {useState, useEffect, useRef} from "react";
import {IUseDataHookConfig} from "../_types/IUseDataHookConfig";
import {IUseDataHookState} from "../_types/IUseDataHookState";

/**
 * Retrieves a hook that can be used to listen to data from data sources,
 * such that the component rerenders upon data changes.
 * It also returns a function to determine whether the data is still loading, or has errored.
 * @param options  Configuration options
 * @returns The data hook followed by contextual data
 */
export const useDataHook = ({
    forceRefreshTime,
    debounce = 0,
    onChange,
}: IUseDataHookConfig = {}): [IDataListener & IDataLoadRequest, IUseDataHookState] => {
    // A fake state in order to force an update
    const [, _update] = useState({});
    const update = () => {
        onChange?.();
        _update({});
    };
    const updateTimeout = useRef(undefined as undefined | number);

    // A variable to track whether any retrieved data is refreshing, and exceptions
    let isRefreshing: boolean = false;
    let exceptions: any[] = [];

    // A list of functions to call to remove the passed listener as a dependency
    const dependencyRemovers = useRef([] as (() => void)[]);

    // Remove all dependencies when the element is removed or rerendered
    const removeDependencies = () => {
        dependencyRemovers.current.forEach(remove => remove());
        dependencyRemovers.current = [];
    };
    removeDependencies();
    useEffect(
        () => () => {
            removeDependencies();

            // Dispose the timeout
            if (updateTimeout.current) {
                clearTimeout(updateTimeout.current);
                onChange?.(true);
            }
        },
        []
    );
    return [
        // Return the listener which will force an update, and registers whether any data is refreshing
        {
            // Data listener fields
            call() {
                if (debounce == -1) update();
                else if (!updateTimeout.current)
                    updateTimeout.current = setTimeout(() => {
                        updateTimeout.current = undefined;
                        update();
                    }, debounce) as any;
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
