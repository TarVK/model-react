/** The optional configuration for the useDataHook function */
export type IUseDataHookConfig = {
    /** The time such that if data is older, it will be refreshed */
    forceRefreshTime?: number;
    /** The number of milliseconds to debounce updates, -1 to forward changes synchronously, defaults to 0 */
    debounce?: number;
    /** Code to call when a data update occurred */
    onChange?: {
        /**
         * A callback when a data update occurred
         * @param unmounted Whether the component already unmounted by now
         */
        (unmounted?: boolean): void;
    };
};
