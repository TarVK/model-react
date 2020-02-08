import {FC, ReactNode} from "react";
import {IDataRetrieverParams} from "../model/_types/IDataRetrieverParams";
import * as React from "react";
import {useDataHook} from "../model/dataRetrievers/useDataHook";

export const Loader: FC<{
    children?: (context: IDataRetrieverParams) => ReactNode;
    content?: (context: IDataRetrieverParams) => ReactNode;
    onLoad?: ReactNode | (() => ReactNode);
    onError?: ReactNode | ((exceptions: any[]) => ReactNode);
}> = ({
    /** An alias for content */
    children,
    /** The content to show when there are no exceptions and data loaded */
    content,
    /** The data to show while loading */
    onLoad,
    /** A function retrieving the data to show */
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
