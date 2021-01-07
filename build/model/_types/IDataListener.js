/**
 * Checks whether the given data satisfies the data listener constraints
 * @param data The data to check
 * @returns Whether the data represents a listener
 */
export const isDataListener = (data) => data && data.call !== undefined && data.registerRemover instanceof Function;
//# sourceMappingURL=IDataListener.js.map