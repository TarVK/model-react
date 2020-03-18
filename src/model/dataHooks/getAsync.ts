import {IDataLoadRequest} from "../_types/IDataLoadRequest";
import {IDataListener} from "../_types/IDataListener";

/**
 * Transforms a normal data getter into a promise that resolves when the data is loaded
 * @param getter The getter function call, which applies the hook
 * @param forceRefreshTime The time such that if data is older, it will be refreshed
 * @returns A promise with the result after all data sources finished loading/refreshing
 */
export const getAsync = async <T>(
    getter: (hook: IDataLoadRequest & IDataListener) => T,
    forceRefreshTime?: number
): Promise<T> =>
    new Promise((res, rej) => {
        /**
         * Performs a data poll, and return the data if it's up to data,
         * otherwise wait for changes
         */
        const poll = () => {
            // Variables to keep track of the state of this poll
            const listenerRemovers: (() => void)[] = [];
            const removeListeners = () => listenerRemovers.forEach(remove => remove());
            let isRefreshing = false;
            let exceptions: any[] = [];

            // Perform the poll
            const result = getter({
                call() {
                    removeListeners();
                    // Poll again if any state changed
                    poll();
                },
                registerRemover(remover: () => void) {
                    listenerRemovers.push(remover);
                },
                markIsLoading() {
                    isRefreshing = true;
                },
                refreshData: true,
                registerException(exception: any) {
                    exceptions.push(exception);
                },
                ...(forceRefreshTime !== undefined && {
                    refreshTimestamp: forceRefreshTime,
                }),
            });

            // Check if there are any exceptions
            if (exceptions.length) {
                removeListeners();
                rej(exceptions);
            }

            // Check whether the retrieved data was up to date
            else if (!isRefreshing) {
                removeListeners();
                res(result);
            }
        };

        // Perform the initial call
        poll();
    });
