import { IDataHook } from "../model/_types/IDataHook";
import { IDataListener } from "../model/_types/IDataListener";
import { IDataLoadRequest } from "../model/_types/IDataLoadRequest";

/**
 * Proxies a data hook, can be used for debugging
 * @param hook The hook to be proxied
 * @param config The config for events to listen for
 * @returns The proxied hook
 */
export function proxyHook(
    hook: IDataHook | undefined,
    config: {
        /** The callback to perform when the hook is getting called */
        onCall?: () => void, 
        /** The callback to perform when the data source indicates to be loading */
        onMarkIsLoading?: ()=>void, 
        /** The callback to perform when the data source registers an exception */
        onRegisterException?: (data:any)=>void}
): IDataHook {
    const h = hook as (IDataListener & IDataLoadRequest) | undefined;
    return {
        call: () => {
            config.onCall?.();
            h?.call();
        },
        registerRemover: remove => {
            h?.registerRemover(remove);
        },
        refreshData: h?.refreshData ?? false,
        markIsLoading: ()=>{
            config.onMarkIsLoading?.();
            h?.markIsLoading?.();
        },
        refreshTimestamp: h?.refreshTimestamp,
        registerException: (exception)=>{
            config.onRegisterException?.(exception);
            h?.registerException?.(exception);
        },
    };
}
