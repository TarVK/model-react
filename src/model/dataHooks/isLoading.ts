import {IDataHook} from "../_types/IDataHook";

/**
 * Retrieves whether data is loading from a data getter
 * @param getter The getter to get the loading state from
 * @returns Whether the getter is loading
 */
export const isLoading = (getter: (l: IDataHook) => void): boolean => {
    // Track whether data is loading
    let isLoading = false;

    // Perform the poll
    getter({
        markIsLoading() {
            isLoading = true;
        },
        refreshData: false,
    });

    // Return the result
    return isLoading;
};
