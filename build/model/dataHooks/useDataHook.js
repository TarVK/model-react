"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDataHook = void 0;
const react_1 = require("react");
/**
 * Retrieves a hook that can be used to listen to data from data sources,
 * such that the component rerenders upon data changes.
 * It also returns a function to determine whether the data is still loading, or has errored.
 * @param options  Configuration options
 * @returns The data hook followed by contextual data
 */
const useDataHook = ({ forceRefreshTime, debounce = 0, onChange, } = {}) => {
    // A fake state in order to force an update
    const [, _update] = react_1.useState({});
    const update = () => {
        onChange === null || onChange === void 0 ? void 0 : onChange();
        _update({});
    };
    const updateTimeout = react_1.useRef(undefined);
    // A variable to track whether any retrieved data is refreshing, and exceptions
    let isRefreshing = false;
    let exceptions = [];
    // A list of functions to call to remove the passed listener as a dependency
    const dependencyRemovers = react_1.useRef([]);
    // Remove all dependencies when the element is removed or rerendered
    const removeDependencies = () => {
        dependencyRemovers.current.forEach(remove => remove());
        dependencyRemovers.current = [];
    };
    removeDependencies();
    react_1.useEffect(() => removeDependencies, []);
    return [
        Object.assign({ 
            // Data listener fields
            call() {
                if (debounce == -1)
                    update();
                else if (!updateTimeout.current)
                    updateTimeout.current = setTimeout(() => {
                        updateTimeout.current = undefined;
                        update();
                    }, debounce);
            },
            registerRemover(remover) {
                dependencyRemovers.current.push(remover);
            }, 
            // Data loading fields
            refreshData: true, markIsLoading() {
                isRefreshing = true;
            }, registerException(exception) {
                exceptions.push(exception);
            } }, (forceRefreshTime !== undefined && { refreshTimestamp: forceRefreshTime })),
        // Return the function that retrieves if any data is refreshing
        { isLoading: () => isRefreshing, getExceptions: () => exceptions },
    ];
};
exports.useDataHook = useDataHook;
//# sourceMappingURL=useDataHook.js.map