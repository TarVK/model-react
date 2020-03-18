"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Retrieves whether data is loading from a data getter
 * @param getter The getter to get the loading state from
 * @returns Whether the getter is loading
 */
exports.isLoading = function (getter) {
    // Track whether data is loading
    var isLoading = false;
    // Perform the poll
    getter({
        markIsLoading: function () {
            isLoading = true;
        },
        refreshData: false,
    });
    // Return the result
    return isLoading;
};
//# sourceMappingURL=isLoading.js.map