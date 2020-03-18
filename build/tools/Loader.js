"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var useDataHook_1 = require("../model/dataHooks/useDataHook");
/**
 * A component to handle the loading or error state of loadable data sources
 */
exports.Loader = function (_a) {
    var 
    /** An alias for content */
    children = _a.children, 
    /** The content to show when there are no exceptions and data loaded */
    content = _a.content, 
    /** The node to show while loading */
    onLoad = _a.onLoad, 
    /** The node to show if an error occurred */
    onError = _a.onError, 
    /** The time such that if data is older, it will be refreshed */
    forceRefreshTime = _a.forceRefreshTime;
    var _b = useDataHook_1.useDataHook(forceRefreshTime), l = _b[0], _c = _b[1], isLoading = _c.isLoading, getExceptions = _c.getExceptions;
    var result = (content || children || (function () { }))(l);
    if (isLoading && isLoading())
        return react_1.default.createElement(react_1.default.Fragment, null, onLoad instanceof Function ? onLoad() : onLoad);
    if (getExceptions) {
        var exceptions = getExceptions();
        if (exceptions.length > 0)
            return react_1.default.createElement(react_1.default.Fragment, null, onError instanceof Function ? onError(exceptions) : onError);
    }
    return react_1.default.createElement(react_1.default.Fragment, null, result);
};
//# sourceMappingURL=Loader.js.map