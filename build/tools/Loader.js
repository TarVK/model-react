"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Loader = void 0;
const React = require("react"); // Required for fragment as separate import due to some config settings
const useDataHook_1 = require("../model/dataHooks/useDataHook");
/**
 * A component to handle the loading or error state of loadable data sources
 */
const Loader = ({ children, content, onLoad, onError, forceRefreshTime, debounce }) => {
    const [h, { isLoading, getExceptions }] = useDataHook_1.useDataHook({ forceRefreshTime, debounce });
    const result = (content || children || (() => { }))(h);
    if (isLoading())
        return React.createElement(React.Fragment, null, onLoad instanceof Function ? onLoad() : onLoad);
    if (getExceptions) {
        const exceptions = getExceptions();
        if (exceptions.length > 0)
            return React.createElement(React.Fragment, null, onError instanceof Function ? onError(exceptions) : onError);
    }
    return React.createElement(React.Fragment, null, result);
};
exports.Loader = Loader;
//# sourceMappingURL=Loader.js.map