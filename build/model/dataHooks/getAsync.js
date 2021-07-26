"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAsync = void 0;
/**
 * Transforms a normal data getter into a promise that resolves when the data is loaded
 * @param getter The getter function call, which applies the hook
 * @param forceRefreshTime The time such that if data is older, it will be refreshed
 * @returns A promise with the result after all data sources finished loading/refreshing
 */
const getAsync = (getter, forceRefreshTime) => __awaiter(void 0, void 0, void 0, function* () {
    return new Promise((res, rej) => {
        /**
         * Performs a data poll, and return the data if it's up to data,
         * otherwise wait for changes
         */
        const poll = () => {
            // Variables to keep track of the state of this poll
            const listenerRemovers = [];
            const removeListeners = () => listenerRemovers.forEach(remove => remove());
            let isRefreshing = false;
            let exceptions = [];
            // Perform the poll
            const result = getter(Object.assign({ call() {
                    removeListeners();
                    // Poll again if any state changed
                    poll();
                },
                registerRemover(remover) {
                    listenerRemovers.push(remover);
                },
                markIsLoading() {
                    isRefreshing = true;
                }, refreshData: true, registerException(exception) {
                    exceptions.push(exception);
                } }, (forceRefreshTime !== undefined && {
                refreshTimestamp: forceRefreshTime,
            })));
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
});
exports.getAsync = getAsync;
//# sourceMappingURL=getAsync.js.map