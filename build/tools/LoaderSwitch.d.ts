import { FC, ReactNode } from "react";
export declare const LoaderSwitch: FC<{
    children?: ReactNode;
    content?: ReactNode;
    onLoad?: ReactNode | (() => ReactNode);
    onError?: ReactNode | ((exceptions: any[]) => ReactNode);
    isLoading?: () => boolean;
    getExceptions?: () => any[];
}>;
