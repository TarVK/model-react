import { useRef } from "react";
import { ActionState } from "../model/dataSources/ActionState";
export function useActionState(hook, latest = false) {
    const actionState = useLazyRef(() => new ActionState());
    // Read the state
    let result;
    if (latest)
        result = actionState.current.getLatest(hook);
    else
        result = actionState.current.get(hook);
    // Return functions to track the data
    return [
        /**
         * Adds an action to be tracked
         * @param action The to be called and tracked, or just the result promise of the action
         * @param reset Whether to remove the old data
         * @returns The result of the action
         */
        (action, reset = false) => actionState.current.addAction(action, reset),
        /**
         * Removes the results of previous actions
         */
        () => actionState.current.reset(),
        /**
         * The return values of all the actions
         */
        result,
    ];
}
/**
 * Uses a reference with a lazy initializer that gets called if the current value is falsy
 * @param init The initializer
 * @returns The ref
 */
const useLazyRef = (init) => {
    const ref = useRef(undefined);
    if (!ref.current)
        ref.current = init();
    return ref;
};
//# sourceMappingURL=useActionState.js.map