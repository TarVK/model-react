/**
 * Retrieves the exceptions that were thrown by the data getter
 * @param getter The getter to get the loading state from
 * @returns The exceptions that were thrown by the getter
 */
export const getExceptions = (getter) => {
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
//# sourceMappingURL=getExceptions.js.map