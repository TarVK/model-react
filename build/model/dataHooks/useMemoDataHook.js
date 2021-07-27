"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useMemoDataHook = void 0;
const react_1 = require("react");
const DataCacher_1 = require("../dataSources/DataCacher");
const useDataHook_1 = require("./useDataHook");
/**
 * Acts like the regular `useMemo` function, except it provides a data hook that can be used for retrieval.
 * `useDataHook` itself shouldn't be used in combination with `useMemo`, see: https://github.com/TarVK/model-react/issues/40.
 * @param dataRetriever The data retriever that computes the value
 * @param dependencies The dependencies that make the memoized value recompute on changes
 * @param config Additional configuration to use for the data hook
 * @returns The cached data, as well as the additional data hook data
 */
function useMemoDataHook(dataRetriever, dependencies, config) {
    const cacher = react_1.useMemo(() => new DataCacher_1.DataCacher(dataRetriever), dependencies);
    const [h, ...d] = useDataHook_1.useDataHook(config);
    return [cacher.get(h), ...d];
}
exports.useMemoDataHook = useMemoDataHook;
//# sourceMappingURL=useMemoDataHook.js.map