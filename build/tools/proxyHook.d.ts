import { IDataHook } from "../model/_types/IDataHook";
/**
 * Proxies a data hook, can be used for debugging
 * @param hook The hook to be proxied
 * @param config The config for events to listen for
 * @returns The proxied hook
 */
export declare function proxyHook(hook: IDataHook | undefined, config: {
    /** The callback to perform when the hook is getting called */
    onCall?: () => void;
    /** The callback to perform when the data source indicates to be loading */
    onMarkIsLoading?: () => void;
    /** The callback to perform when the data source registers an exception */
    onRegisterException?: (data: any) => void;
}): IDataHook;
//# sourceMappingURL=proxyHook.d.ts.map