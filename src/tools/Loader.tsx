import { FC, ReactNode } from "react";
import { IDataRetrieverParams } from "../model/_types/IDataRetriever";
import * as React from "react";
import { useDataHook } from "../model/dataRetrievers/useDataHook";

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
  onLoad = "Loading",
  /** A function retrieving the data to show */
  onError = e => (
    <div style={{ backgroundColor: "red" }}>Something went wrong: {e}</div>
  )
}) => {
  const [l, { isLoading, getExceptions }] = useDataHook();
  const result = (content || children || (() => {}))(l);

  if (getExceptions) {
    const exceptions = getExceptions();
    if (exceptions.length > 0)
      return <>{onError instanceof Function ? onError(exceptions) : onError}</>;
  }

  if (isLoading && isLoading())
    return <>{onLoad instanceof Function ? onLoad() : onLoad}</>;

  return <>{result}</>;
};
