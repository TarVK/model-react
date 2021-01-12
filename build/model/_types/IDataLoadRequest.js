"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDataLoadRequest = void 0;
/**
 * Checks whether the given data satisfies the data load request constraints
 * @param data The data to check
 * @returns Whether the data represents a data load request
 */
const isDataLoadRequest = (data) => data &&
    (data.refreshData !== undefined ||
        data.registerException instanceof Function ||
        data.markIsLoading instanceof Function);
exports.isDataLoadRequest = isDataLoadRequest;
//# sourceMappingURL=IDataLoadRequest.js.map