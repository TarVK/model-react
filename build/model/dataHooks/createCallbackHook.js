/**
 * Creates a data hook that can be used for a single time callback
 * @param callback The callback to be triggered
 * @param forceRefreshTime  The time such that if data is older, it will be refreshed
 * @returns The created data hook, and a function to destroy it before it gets fired
 */
export function createCallbackHook(callback, forceRefreshTime) {
    let hookListenerRemovers = [];
    const remove = () => {
        hookListenerRemovers.forEach(remover => remover());
        hookListenerRemovers = [];
    };
    return [
        Object.assign({ call: () => {
                remove();
                callback();
            }, registerRemover: (remover) => {
                hookListenerRemovers.push(remover);
            }, refreshData: forceRefreshTime !== undefined }, (forceRefreshTime !== undefined && { refreshTimestamp: forceRefreshTime })),
        remove,
    ];
}
//# sourceMappingURL=createCallbackHook.js.map