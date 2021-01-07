import { FC, ReactNode } from "react";
import { IDataHook } from "../model/_types/IDataHook";
/**
 * A component to handle the loading or error state of loadable data sources
 */
export declare const Loader: FC<{
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
}>;
//# sourceMappingURL=Loader.d.ts.map