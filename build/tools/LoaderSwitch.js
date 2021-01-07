import * as React from "react"; // Required for fragment as separate import due to some config settings
/**
 * A component to handle the loading or error state of loadable data sources
 */
export const LoaderSwitch = ({ children, content, onLoad, onError, isLoading, getExceptions }) => {
    if (isLoading && isLoading() && onLoad)
        return React.createElement(React.Fragment, null, onLoad instanceof Function ? onLoad() : onLoad);
    if (getExceptions && onError) {
        const exceptions = getExceptions();
        if (exceptions.length > 0)
            return React.createElement(React.Fragment, null, onError instanceof Function ? onError(exceptions) : onError);
    }
    return React.createElement(React.Fragment, null, (content || children));
};
//# sourceMappingURL=LoaderSwitch.js.map