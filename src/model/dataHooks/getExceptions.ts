import {IDataHook} from "../_types/IDataHook";

/**
 * Retrieves the exceptions that were thrown by the data getter
 * @param getter The getter to get the loading state from
 * @returns The exceptions that were thrown by the getter
 */
export const getExceptions = (getter: (h: IDataHook) => void): any[] => {
    // Track the exceptions
    const exceptions: any[] = [];

    // Perform the poll
    getter({
        registerException(exception: any) {
            exceptions.push(exception);
        },
        refreshData: false,
    });

    // Return the result
    return exceptions;
};
