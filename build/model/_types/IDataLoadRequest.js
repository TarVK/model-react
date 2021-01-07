/**
 * Checks whether the given data satisfies the data load request constraints
 * @param data The data to check
 * @returns Whether the data represents a data load request
 */
export const isDataLoadRequest = (data) => data &&
    (data.refreshData !== undefined ||
        data.registerException instanceof Function ||
        data.markIsLoading instanceof Function);
//# sourceMappingURL=IDataLoadRequest.js.map