"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Retrieves the exceptions that were thrown by the data getter
 * @param getter The getter to get the loading state from
 * @returns The exceptions that were thrown by the loader
 */
exports.getExceptions = function (getter) {
    // Track the exceptions
    var exceptions = [];
    // Perform the poll
    getter({
        registerException: function (exception) {
            exceptions.push(exception);
        },
        refreshData: false,
    });
    // Return the result
    return exceptions;
};
//# sourceMappingURL=getExceptions.js.map