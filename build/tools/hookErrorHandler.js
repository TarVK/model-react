"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleHookError = exports.setHookErrorHandler = void 0;
let errorHandler = console.error;
/**
 * Sets the handler to call when a hook's call results in an error
 * @param handler The handler to call
 */
const setHookErrorHandler = (handler) => {
    errorHandler = handler;
};
exports.setHookErrorHandler = setHookErrorHandler;
/**
 * Handles the error that occurred when calling a datahook
 */
const handleHookError = (...args) => errorHandler(...args);
exports.handleHookError = handleHookError;
//# sourceMappingURL=hookErrorHandler.js.map