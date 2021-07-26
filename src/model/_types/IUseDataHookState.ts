export type IUseDataHookState = {
    /** Retrieves whether any obtained data is currently loading */
    isLoading: () => boolean;
    /** Retrieves the exceptions that may have occurred while loading */
    getExceptions: () => any[];
};
