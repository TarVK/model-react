import { FC, ReactNode } from "react";
import { IDataRetrieverParams } from "../model/_types/IDataRetrieverParams";
export declare const Loader: FC<{
    children?: (context: IDataRetrieverParams) => ReactNode;
    content?: (context: IDataRetrieverParams) => ReactNode;
    onLoad?: ReactNode | (() => ReactNode);
    onError?: ReactNode | ((exceptions: any[]) => ReactNode);
}>;
