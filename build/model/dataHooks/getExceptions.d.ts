/**
 * Retrieves the exceptions that were thrown by the data getter
 * @param getter The getter to get the loading state from
 * @returns The exceptions that were thrown by the loader
 */
export declare const getExceptions: (getter: (l: import("../_types/IDataHook").IStrictDataHook) => void) => any[];
