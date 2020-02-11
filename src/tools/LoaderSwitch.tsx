import {FC, ReactNode} from "react";
import * as React from "react";

/**
 * A component to handle the loading or error state of loadable data sources
 */
export const LoaderSwitch: FC<{
    children?: ReactNode;
    content?: ReactNode;
    onLoad?: ReactNode | (() => ReactNode);
    onError?: ReactNode | ((exceptions: any[]) => ReactNode);
    isLoading?: () => boolean;
    getExceptions?: () => any[];
}> = ({
    /** An alias for content */
    children,
    /** The content to show when there are no exceptions and data loaded */
    content,
    /** The node to show while loading */
    onLoad,
    /** The node to show if an error occured */
    onError,
    /** A function to check whether the data is currently loading */
    isLoading,
    /** A getter for the exceptions */
    getExceptions,
}) => {
    if (isLoading && isLoading() && onLoad)
        return <>{onLoad instanceof Function ? onLoad() : onLoad}</>;

    if (getExceptions && onError) {
        const exceptions = getExceptions();
        if (exceptions.length > 0)
            return <>{onError instanceof Function ? onError(exceptions) : onError}</>;
    }

    return <>{(content || children) as any}</>;
};
