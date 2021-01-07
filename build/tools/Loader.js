import * as React from "react"; // Required for fragment as separate import due to some config settings
import { useDataHook } from "../model/dataHooks/useDataHook";
/**
 * A component to handle the loading or error state of loadable data sources
 */
export const Loader = ({ children, content, onLoad, onError, forceRefreshTime, debounce }) => {
    const [h, { isLoading, getExceptions }] = useDataHook({ forceRefreshTime, debounce });
    const result = (content || children || (() => { }))(h);
    if (isLoading && isLoading())
        return React.createElement(React.Fragment, null, onLoad instanceof Function ? onLoad() : onLoad);
    if (getExceptions) {
        const exceptions = getExceptions();
        if (exceptions.length > 0)
            return React.createElement(React.Fragment, null, onError instanceof Function ? onError(exceptions) : onError);
    }
    return React.createElement(React.Fragment, null, result);
};
//# sourceMappingURL=Loader.js.map