import {useMemo} from "react";
import {DataCacher} from "../dataSources/DataCacher";
import {IDataRetriever} from "../_types/IDataRetriever";
import {IUseDataHookConfig} from "../_types/IUseDataHookConfig";
import {IUseDataHookState} from "../_types/IUseDataHookState";
import {useDataHook} from "./useDataHook";

/**
 * Acts like the regular `useMemo` function, except it provides a data hook that can be used for retrieval.
 * `useDataHook` itself shouldn't be used in combination with `useMemo`, see: https://github.com/TarVK/model-react/issues/40.
 * @param dataRetriever The data retriever that computes the value
 * @param dependencies The dependencies that make the memoized value recompute on changes
 * @param config Additional configuration to use for the data hook
 * @returns The cached data, as well as the additional data hook data
 */
export function useMemoDataHook<D>(
    dataRetriever: IDataRetriever<D>,
    dependencies: React.DependencyList,
    config?: IUseDataHookConfig
): [D, IUseDataHookState] {
    const cacher = useMemo(() => new DataCacher(dataRetriever), dependencies);
    const [h, ...d] = useDataHook(config);
    return [cacher.get(h), ...d];
}
