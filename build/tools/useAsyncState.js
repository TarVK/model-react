"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var IDataListener_1 = require("../model/_types/IDataListener");
var IDataLoadRequest_1 = require("../model/_types/IDataLoadRequest");
/**
 * Creates a function to use the async state of a
 * @param l The data hook to forward the state to
 * @returns A function that promises can be wrapped with to track their state, and a function to reset the state (mainly errors)
 */
exports.useAsyncState = function (l) {
    // Keep track of both the exceptions that occured, and the number of promises that are loading
    var _a = react_1.useState([]), exceptions = _a[0], setExceptions = _a[1];
    var _b = react_1.useState(0), loadingCount = _b[0], setLoadingCount = _b[1];
    // Keep track of listeners
    var listeners = react_1.useRef([]).current;
    if (IDataListener_1.isDataListener(l)) {
        if (!listeners.includes(l))
            listeners.push(l);
        l.registerRemover(function () {
            var index = listeners.indexOf(l);
            if (index != -1)
                listeners.splice(index, 1);
        });
    }
    // Pass the data to the data hook
    if (IDataLoadRequest_1.isDataLoadRequest(l)) {
        if (loadingCount > 0 && l.markShouldRefresh)
            l.markShouldRefresh();
        if (l.registerException)
            exceptions.forEach(function (exception) { return l.registerException(exception); });
    }
};
//# sourceMappingURL=useAsyncState.js.map