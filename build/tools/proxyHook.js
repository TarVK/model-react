"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.proxyHook = void 0;
/**
 * Proxies a data hook, can be used for debugging
 * @param hook The hook to be proxied
 * @param config The config for events to listen for
 * @returns The proxied hook
 */
const proxyHook = (hook, config) => {
    var _a;
    const h = hook;
    return {
        call: () => {
            var _a;
            (_a = config.onCall) === null || _a === void 0 ? void 0 : _a.call(config);
            h === null || h === void 0 ? void 0 : h.call();
        },
        registerRemover: remove => {
            h === null || h === void 0 ? void 0 : h.registerRemover(remove);
        },
        refreshData: (_a = h === null || h === void 0 ? void 0 : h.refreshData) !== null && _a !== void 0 ? _a : false,
        markIsLoading: () => {
            var _a, _b;
            (_a = config.onMarkIsLoading) === null || _a === void 0 ? void 0 : _a.call(config);
            (_b = h === null || h === void 0 ? void 0 : h.markIsLoading) === null || _b === void 0 ? void 0 : _b.call(h);
        },
        refreshTimestamp: h === null || h === void 0 ? void 0 : h.refreshTimestamp,
        registerException: exception => {
            var _a, _b;
            (_a = config.onRegisterException) === null || _a === void 0 ? void 0 : _a.call(config, exception);
            (_b = h === null || h === void 0 ? void 0 : h.registerException) === null || _b === void 0 ? void 0 : _b.call(h, exception);
        },
    };
};
exports.proxyHook = proxyHook;
//# sourceMappingURL=proxyHook.js.map