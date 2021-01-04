import {IDataHookErrorHandler} from "../model/_types/IDataHookErrorHandler";

let errorHandler: IDataHookErrorHandler = console.error;

/**
 * Sets the handler to call when a hook's call results in an error
 * @param handler The handler to call
 */
export function setHookErrorHandler(handler: IDataHookErrorHandler): void {
    errorHandler = handler;
}

/**
 * Handles the error that occurred when calling a datahook
 */
export const handleHookError: IDataHookErrorHandler = (...args) => errorHandler(...args);
