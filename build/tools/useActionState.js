"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var react_1 = require("react");
var ActionState_1 = require("../model/dataSources/ActionState");
function useActionState(hook, latest) {
    if (latest === void 0) { latest = false; }
    var actionState = react_1.useRef(undefined);
    if (!actionState.current)
        actionState.current = new ActionState_1.ActionState();
    // Read the state
    var result;
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
        function (action, reset) {
            if (reset === void 0) { reset = false; }
            return actionState.current.addAction(action, reset);
        },
        /**
         * Removes the results of previous actions
         */
        function () { return actionState.current.reset(); },
        /**
         * The return values of all the actions
         */
        result,
    ];
}
exports.useActionState = useActionState;
//# sourceMappingURL=useActionState.js.map