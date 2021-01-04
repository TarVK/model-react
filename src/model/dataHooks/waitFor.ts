import { IDataHook } from "../_types/IDataHook";
import { getAsync } from "./getAsync";

/**
 * Waits for a condition to become true
 * @param condition The getter to get the condition result from
 * @returns A promise that resolves once the condition is met
 */
export async function waitFor(condition: (hook: IDataHook) => boolean): Promise<void> {
    await getAsync(h => {
        if (!condition(h)) h.markIsLoading?.();
    });
}