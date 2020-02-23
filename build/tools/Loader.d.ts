import { FC, ReactNode } from "react";
import { IDataRetrieverParams } from "../model/_types/IDataRetrieverParams";
/**
 * A component to handle the loading or error state of loadable data sources
 */
export declare const Loader: FC<{
    children?: (hook: IDataRetrieverParams) => ReactNode;
    content?: (hook: IDataRetrieverParams) => ReactNode;
    onLoad?: ReactNode | (() => ReactNode);
    onError?: ReactNode | ((exceptions: any[]) => ReactNode);
    forceRefreshTime?: number;
}>;
