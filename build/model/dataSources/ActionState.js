"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractDataSource_1 = require("./AbstractDataSource");
var IDataLoadRequest_1 = require("../_types/IDataLoadRequest");
var ActionState = /** @class */ (function (_super) {
    __extends(ActionState, _super);
    /**
     * Creates a new action state, used to track the state of async actions/function calls
     */
    function ActionState() {
        var _this = _super.call(this) || this;
        // The actions being tracked
        _this.actions = [];
        return _this;
    }
    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    ActionState.prototype.get = function (hook) {
        _super.prototype.addListener.call(this, hook);
        this.forwardState(hook);
        return this.actions.filter(function (_a) {
            var loading = _a.loading;
            return !loading;
        }).map(function (_a) {
            var result = _a.result;
            return result;
        });
    };
    /**
     * Retrieves the last added action
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The action data
     */
    ActionState.prototype.getLatest = function (hook) {
        _super.prototype.addListener.call(this, hook);
        this.forwardState(hook, true);
        return this.actions.length !== 0
            ? this.actions[this.actions.length - 1].result
            : undefined;
    };
    /**
     * Forwards the state of the retriever being cached
     * @param hook Data to hook into the meta state and to notify about state changes
     */
    ActionState.prototype.forwardState = function (hook, last) {
        if (last === void 0) { last = false; }
        if (IDataLoadRequest_1.isDataLoadRequest(hook)) {
            var actions = last
                ? this.actions.slice(this.actions.length - 1)
                : this.actions;
            if (hook.registerException)
                actions.forEach(function (_a) {
                    var exception = _a.exception, threw = _a.threw;
                    return threw && hook.registerException(exception);
                });
            if (hook.markIsLoading && actions.find(function (_a) {
                var loading = _a.loading;
                return loading;
            }))
                hook.markIsLoading();
        }
    };
    // Managing the actions
    /**
     * Adds an action to be tracked
     * @param action The to be called and tracked, or just the result promise of the action
     * @param reset Whether to remove the old data
     * @returns The result of the action
     */
    ActionState.prototype.addAction = function (action, reset) {
        var _this = this;
        if (reset === void 0) { reset = false; }
        if (action instanceof Function)
            action = action();
        if (reset)
            this.actions = [];
        // Create a temporary result
        var data = {
            result: undefined,
            promise: action,
            threw: false,
            exception: undefined,
            loading: true,
        };
        this.actions.push(data);
        this.callListeners();
        // Make the result update when the the action resolves or rejects
        var actions = this.actions;
        action
            .then(function (res) {
            // Check if we didn't reset the actions
            if (actions == _this.actions) {
                data.loading = false;
                data.result = res;
                _this.callListeners();
            }
        })
            .catch(function (err) {
            // Check if we didn't reset the actions
            if (actions == _this.actions) {
                data.loading = false;
                data.threw = true;
                data.exception = err;
                _this.callListeners();
            }
        });
        // Return the action itself for simple inline usage
        return action;
    };
    /**
     * Removes the results of previous actions
     */
    ActionState.prototype.reset = function () {
        this.actions = [];
        this.callListeners();
    };
    return ActionState;
}(AbstractDataSource_1.AbstractDataSource));
exports.ActionState = ActionState;
//# sourceMappingURL=ActionState.js.map