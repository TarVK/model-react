"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Checks whether the given data satisfies the data listener constraints
 * @param data The data to check
 * @returns Whether the data represents a listener
 */
exports.isDataListener = function (data) {
    return data && data.call !== undefined && data.registerRemover instanceof Function;
};
//# sourceMappingURL=IDataListener.js.map