"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLoading = void 0;
/**
 * Retrieves whether data is loading from a data getter
 * @param getter The getter to get the loading state from
 * @returns Whether the getter is loading
 */
const isLoading = (getter) => {
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
exports.isLoading = isLoading;
//# sourceMappingURL=isLoading.js.map