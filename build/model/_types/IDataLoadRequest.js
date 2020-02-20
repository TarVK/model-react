"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Checks whether the given data satisfies the data load request constraints
 * @param data The data to check
 * @returns Whether the data represents a data load request
 */
exports.isDataLoadRequest = function (data) {
    return data &&
        (data.refreshData === undefined ||
            data.registerException instanceof Function ||
            data.markShouldRefresh instanceof Function);
};
//# sourceMappingURL=IDataLoadRequest.js.map