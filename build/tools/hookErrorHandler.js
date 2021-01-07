let errorHandler = console.error;
/**
 * Sets the handler to call when a hook's call results in an error
 * @param handler The handler to call
 */
export function setHookErrorHandler(handler) {
    errorHandler = handler;
}
/**
 * Handles the error that occurred when calling a datahook
 */
export const handleHookError = (...args) => errorHandler(...args);
//# sourceMappingURL=hookErrorHandler.js.map