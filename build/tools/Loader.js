import * as React from "react";
import { useDataHook } from "../model/dataHooks/useDataHook";
/**
 * A component to handle the loading or error state of loadable data sources
 */
export var Loader = function (_a) {
    var 
    /** An alias for content */
    children = _a.children, 
    /** The content to show when there are no exceptions and data loaded */
    content = _a.content, 
    /** The node to show while loading */
    onLoad = _a.onLoad, 
    /** The node to show if an error occured */
    onError = _a.onError;
    var _b = useDataHook(), l = _b[0], _c = _b[1], isLoading = _c.isLoading, getExceptions = _c.getExceptions;
    var result = (content || children || (function () { }))(l);
    if (isLoading && isLoading())
        return React.createElement(React.Fragment, null, onLoad instanceof Function ? onLoad() : onLoad);
    if (getExceptions) {
        var exceptions = getExceptions();
        if (exceptions.length > 0)
            return React.createElement(React.Fragment, null, onError instanceof Function ? onError(exceptions) : onError);
    }
    return React.createElement(React.Fragment, null, result);
};
//# sourceMappingURL=Loader.js.map