import { IDataLoadRequest } from "../_types/IDataLoadRequest";
import { IDataListener } from "../_types/IDataListener";
import { useState, useEffect, useRef } from "react";

/**
 * Retrieves a hook that can be used to listen to data from data sources, such that the component rerenders upon data changes.
 * As well a function to determine whether the data is still loading
 * @param forceRefreshTime The time such that if data is loader, it will be refreshed
 * @returns The data hook followed by contextual data
 */
export const useDataHook = (
  refreshTime?: number
): [
  IDataListener & IDataLoadRequest,
  { isLoading: () => boolean; getExceptions: () => any[] }
] => {
  // A fake state in order to fore an update
  const [, update] = useState();

  // A variable to track whether any retrieved data is refreshing, and exceptions
  let isRefreshing: boolean;
  let exceptions: any[] = [];

  // A list of functions to call to remove the passed listener as a dependency
  const dependencyRemovers = useRef([] as (() => void)[]);

  // Remove all dependencies when the element is removed or remerendered
  dependencyRemovers.current.forEach(remove => remove());
  useEffect(
    () => () => dependencyRemovers.current.forEach(remove => remove()),
    []
  );
  return [
    // Return the listener which will force an update, and registers whether any data is refreshing
    {
      call() {
        update({});
      },
      registerRemover(remover: () => void) {
        dependencyRemovers.current.push(remover);
      },
      refreshData: true,
      markShouldRefresh() {
        isRefreshing = true;
      },
      registerException(exception: any) {
        exceptions.push(exception);
      },
      ...(refreshTime !== undefined && { refreshTime })
    },
    // Return the function that retrieves if any data is refreshing
    { isLoading: () => isRefreshing, getExceptions: () => exceptions }
  ];
};
