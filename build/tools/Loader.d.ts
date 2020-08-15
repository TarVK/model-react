import { FC, ReactNode } from "react";
import { IDataHook } from "../model/_types/IDataHook";
/**
 * A component to handle the loading or error state of loadable data sources
 */
export declare const Loader: FC<{
    children?: (hook: IDataHook) => ReactNode;
    content?: (hook: IDataHook) => ReactNode;
    onLoad?: ReactNode | (() => ReactNode);
    onError?: ReactNode | ((exceptions: any[]) => ReactNode);
    forceRefreshTime?: number;
}>;
//# sourceMappingURL=Loader.d.ts.map