import {IDataHook} from "./IDataHook";

/** The error handler for hooks */
export type IDataHookErrorHandler = {
    /**
     * Handles the given exception that occurred when calling a data hook
     * @param exception The exception that occurred
     * @param dataSource The data source that invoked the hook
     * @param hook The hook that got called
     * @param type The type of the call that errored
     */
    (
        exception: any,
        dataSource: any,
        hook: IDataHook | undefined,
        type: "onCall" | "registerException" | "markIsLoading"
    ): void;
};
