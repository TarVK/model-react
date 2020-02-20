"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
/**
 * Retrieves a hook that can be used to listen to data from data sources,
 * such that the component rerenders upon data changes.
 * It also returns a function to determine whether the data is still loading, or has errored.
 * @param forceRefreshTime The time such that if data is older, it will be refreshed
 * @returns The data hook followed by contextual data
 */
exports.useDataHook = function (forceRefreshTime) {
    // A fake state in order to fore an update
    var _a = react_1.useState(), update = _a[1];
    // A variable to track whether any retrieved data is refreshing, and exceptions
    var isRefreshing;
    var exceptions = [];
    // A list of functions to call to remove the passed listener as a dependency
    var dependencyRemovers = react_1.useRef([]);
    // Remove all dependencies when the element is removed or remerendered
    dependencyRemovers.current.forEach(function (remove) { return remove(); });
    react_1.useEffect(function () { return function () { return dependencyRemovers.current.forEach(function (remove) { return remove(); }); }; }, []);
    return [
        __assign({ call: function () {
                update({});
            },
            registerRemover: function (remover) {
                dependencyRemovers.current.push(remover);
            }, refreshData: true, markShouldRefresh: function () {
                isRefreshing = true;
            },
            registerException: function (exception) {
                exceptions.push(exception);
            } }, (forceRefreshTime !== undefined && { refreshTime: forceRefreshTime })),
        // Return the function that retrieves if any data is refreshing
        { isLoading: function () { return isRefreshing; }, getExceptions: function () { return exceptions; } },
    ];
};
//# sourceMappingURL=useDataHook.js.map