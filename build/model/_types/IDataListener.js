/**
 * Checks whether the given data satisfies the data listener constraints
 * @param data The data to check
 * @returns Whether the data represents a listener
 */
export var isDataListener = function (data) {
    return data && data.call !== undefined && data.registerRemover instanceof Function;
};
//# sourceMappingURL=IDataListener.js.map