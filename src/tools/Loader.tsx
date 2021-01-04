import {FC, ReactNode} from "react";
import * as React from "react"; // Required for fragment as separate import due to some config settings
import {IDataHook} from "../model/_types/IDataHook";
import {useDataHook} from "../model/dataHooks/useDataHook";

/**
 * A component to handle the loading or error state of loadable data sources
 */
export const Loader: FC<{
    /** An alias for content */
    children?: (hook: IDataHook) => ReactNode;
    /** The content to show when there are no exceptions and data loaded */
    content?: (hook: IDataHook) => ReactNode;
    /** The node to show while loading */
    onLoad?: ReactNode | (() => ReactNode);
    /** The node to show if an error occurred */
    onError?: ReactNode | ((exceptions: any[]) => ReactNode);
    /** The time such that if data is older, it will be refreshed */
    forceRefreshTime?: number;
    /** The number of milliseconds to debounce updates, -1 to forward changes synchronously, defaults to 0 */
    debounce?: number;
}> = ({children, content, onLoad, onError, forceRefreshTime, debounce}) => {
    const [h, {isLoading, getExceptions}] = useDataHook({forceRefreshTime, debounce});
    const result = (content || children || (() => {}))(h);

    if (isLoading && isLoading())
        return <>{onLoad instanceof Function ? onLoad() : onLoad}</>;

    if (getExceptions) {
        const exceptions = getExceptions();
        if (exceptions.length > 0)
            return <>{onError instanceof Function ? onError(exceptions) : onError}</>;
    }

    return <>{result}</>;
};
