import { IDataHook } from "../_types/IDataHook";
/**
 * Creates a data hook that can be used for a single time callback
 * @param callback The callback to be triggered
 * @param forceRefreshTime  The time such that if data is older, it will be refreshed
 * @returns The created data hook, and a function to destroy it before it gets fired
 */
export declare function createCallbackHook(callback: () => void, forceRefreshTime?: number): [IDataHook, () => void];
//# sourceMappingURL=createCallbackHook.d.ts.map