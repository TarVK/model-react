"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isDataListener = void 0;
/**
 * Checks whether the given data satisfies the data listener constraints
 * @param data The data to check
 * @returns Whether the data represents a listener
 */
const isDataListener = (data) => data && data.call !== undefined && data.registerRemover instanceof Function;
exports.isDataListener = isDataListener;
//# sourceMappingURL=IDataListener.js.map