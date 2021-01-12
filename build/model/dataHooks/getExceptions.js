"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExceptions = void 0;
/**
 * Retrieves the exceptions that were thrown by the data getter
 * @param getter The getter to get the loading state from
 * @returns The exceptions that were thrown by the getter
 */
const getExceptions = (getter) => {
    // Track the exceptions
    const exceptions = [];
    // Perform the poll
    getter({
        registerException(exception) {
            exceptions.push(exception);
        },
        refreshData: false,
    });
    // Return the result
    return exceptions;
};
exports.getExceptions = getExceptions;
//# sourceMappingURL=getExceptions.js.map