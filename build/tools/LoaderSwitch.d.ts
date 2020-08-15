import { FC, ReactNode } from "react";
/**
 * A component to handle the loading or error state of loadable data sources
 */
export declare const LoaderSwitch: FC<{
    children?: ReactNode;
    content?: ReactNode;
    onLoad?: ReactNode | (() => ReactNode);
    onError?: ReactNode | ((exceptions: any[]) => ReactNode);
    isLoading?: () => boolean;
    getExceptions?: () => any[];
}>;
//# sourceMappingURL=LoaderSwitch.d.ts.map