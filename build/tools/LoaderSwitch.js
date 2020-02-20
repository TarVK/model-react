"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
/**
 * A component to handle the loading or error state of loadable data sources
 */
exports.LoaderSwitch = function (_a) {
    var 
    /** An alias for content */
    children = _a.children, 
    /** The content to show when there are no exceptions and data loaded */
    content = _a.content, 
    /** The node to show while loading */
    onLoad = _a.onLoad, 
    /** The node to show if an error occured */
    onError = _a.onError, 
    /** A function to check whether the data is currently loading */
    isLoading = _a.isLoading, 
    /** A getter for the exceptions */
    getExceptions = _a.getExceptions;
    if (isLoading && isLoading() && onLoad)
        return React.createElement(React.Fragment, null, onLoad instanceof Function ? onLoad() : onLoad);
    if (getExceptions && onError) {
        var exceptions = getExceptions();
        if (exceptions.length > 0)
            return React.createElement(React.Fragment, null, onError instanceof Function ? onError(exceptions) : onError);
    }
    return React.createElement(React.Fragment, null, (content || children));
};
//# sourceMappingURL=LoaderSwitch.js.map