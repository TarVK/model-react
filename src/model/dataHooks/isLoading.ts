import {IDataRetrieverParams} from "../_types/IDataRetrieverParams";

/**
 * Retrieves whether data is loading from a data getter
 * @param getter The getter to get the loading state from
 * @returns Whether the getter is loading
 */
export const isLoading = (getter: (l: IDataRetrieverParams) => void): boolean => {
    // Track whether data is loading
    let isLoading = false;

    // Perform the poll
    getter({
        markShouldRefresh() {
            isLoading = true;
        },
        refreshData: false,
    });

    // Return the result
    return isLoading;
};
