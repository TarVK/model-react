import {FC, ReactNode} from "react";
import * as React from "react"; // Required for fragment as separate import due to some config settings
import {IDataHook} from "../model/_types/IDataHook";
import {useDataHook} from "../model/dataHooks/useDataHook";

/**
 * A component to handle the loading or error state of loadable data sources
 */
export const Loader: FC<{
    children?: (hook: IDataHook) => ReactNode;
    content?: (hook: IDataHook) => ReactNode;
    onLoad?: ReactNode | (() => ReactNode);
    onError?: ReactNode | ((exceptions: any[]) => ReactNode);
    forceRefreshTime?: number;
}> = ({
    /** An alias for content */
    children,
    /** The content to show when there are no exceptions and data loaded */
    content,
    /** The node to show while loading */
    onLoad,
    /** The node to show if an error occurred */
    onError,
    /** The time such that if data is older, it will be refreshed */
    forceRefreshTime,
}) => {
    const [h, {isLoading, getExceptions}] = useDataHook(forceRefreshTime);
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
