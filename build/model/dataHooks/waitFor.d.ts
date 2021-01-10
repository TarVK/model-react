import { IDataHook } from "../_types/IDataHook";
/**
 * Waits for a condition to become true
 * @param condition The getter to get the condition result from
 * @returns A promise that resolves once the condition is met
 */
export declare const waitFor: (condition: (hook: IDataHook) => boolean) => Promise<void>;
//# sourceMappingURL=waitFor.d.ts.map