import {FC, ReactNode} from "react";
import * as React from "react"; // Required for fragment as separate import due to some config settings

/**
 * A component to handle the loading or error state of loadable data sources
 */
export const LoaderSwitch: FC<{
    /** An alias for content */
    children?: ReactNode;
    /** The content to show when there are no exceptions and data loaded */
    content?: ReactNode;
    /** The node to show while loading */
    onLoad?: ReactNode | (() => ReactNode);
    /** The node to show if an error occured */
    onError?: ReactNode | ((exceptions: any[]) => ReactNode);
    /** A function to check whether the data is currently loading */
    isLoading?: () => boolean;
    /** A getter for the exceptions */
    getExceptions?: () => any[];
}> = ({children, content, onLoad, onError, isLoading, getExceptions}) => {
    if (isLoading && isLoading() && onLoad)
        return <>{onLoad instanceof Function ? onLoad() : onLoad}</>;

    if (getExceptions && onError) {
        const exceptions = getExceptions();
        if (exceptions.length > 0)
            return <>{onError instanceof Function ? onError(exceptions) : onError}</>;
    }

    return <>{(content || children) as any}</>;
};
