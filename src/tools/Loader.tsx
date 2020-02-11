import {FC, ReactNode} from "react";
import {IDataRetrieverParams} from "../model/_types/IDataRetrieverParams";
import * as React from "react";
import {useDataHook} from "../model/dataHooks/useDataHook";

/**
 * A component to handle the loading or error state of loadable data sources
 */
export const Loader: FC<{
    children?: (hook: IDataRetrieverParams) => ReactNode;
    content?: (hook: IDataRetrieverParams) => ReactNode;
    onLoad?: ReactNode | (() => ReactNode);
    onError?: ReactNode | ((exceptions: any[]) => ReactNode);
}> = ({
    /** An alias for content */
    children,
    /** The content to show when there are no exceptions and data loaded */
    content,
    /** The node to show while loading */
    onLoad,
    /** The node to show if an error occured */
    onError,
}) => {
    const [l, {isLoading, getExceptions}] = useDataHook();
    const result = (content || children || (() => {}))(l);

    if (isLoading && isLoading())
        return <>{onLoad instanceof Function ? onLoad() : onLoad}</>;

    if (getExceptions) {
        const exceptions = getExceptions();
        if (exceptions.length > 0)
            return <>{onError instanceof Function ? onError(exceptions) : onError}</>;
    }

    return <>{result}</>;
};
