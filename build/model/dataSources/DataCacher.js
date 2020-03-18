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
var DataCacher = /** @class */ (function (_super) {
    __extends(DataCacher, _super);
    /**
     * Creates a new data cache, used to reduce number of calls to complex data transformers
     * @param source The function to use to compute the value
     */
    function DataCacher(source) {
        var _this = _super.call(this) || this;
        // The function to remove the dependency hook
        _this.dependencyRemovers = [];
        // Status variables
        _this.loading = false;
        _this.lastLoadTime = 0;
        _this.source = source;
        return _this;
    }
    /**
     * Updates the data if there is no dependency yet, or if a newer freshTimestamp is supplied
     * @param hook Data to know whether to reload
     */
    DataCacher.prototype.updateIfRequired = function (params) {
        var _this = this;
        // Make sure we don't have a dependency already, unless we want to force reload
        var refreshTimestamp = IDataLoadRequest_1.isDataLoadRequest(params) &&
            params.refreshData &&
            params.refreshTimestamp > this.lastLoadTime &&
            params.refreshTimestamp;
        if (this.dependencyRemovers.length !== 0 && !refreshTimestamp)
            return;
        // Remove the old dependency listeners if there are any
        this.dependencyRemovers.forEach(function (remove) { return remove(); });
        var dependencyRemoves = (this.dependencyRemovers = []);
        // Reset the state data
        this.exceptions = [];
        this.loading = false;
        this.lastLoadTime = Date.now();
        // If a change occurs, remove the previous dependency listener and call own listeners
        var onChange = function () {
            // Make sure this isn't an outdated dependency listener
            if (dependencyRemoves !== _this.dependencyRemovers)
                return;
            // Remove the currently dependencies, allowing for reload
            _this.dependencyRemovers.forEach(function (remove) { return remove(); });
            _this.dependencyRemovers = [];
            // Inform our listeners
            _this.callListeners();
        };
        // Retrieve the new value and setup the new listener
        this.cached = this.source({
            refreshData: true,
            refreshTimestamp: refreshTimestamp,
            call: onChange,
            markIsLoading: function () {
                _this.loading = true;
            },
            registerException: function (exception) {
                _this.exceptions.push(exception);
            },
            registerRemover: function (remover) {
                dependencyRemoves.push(remover);
            },
        }, this.cached);
    };
    /**
     * Forwards the state of the retriever being cached
     * @param hook Data used to notify about state changes
     */
    DataCacher.prototype.forwardState = function (hook) {
        if (IDataLoadRequest_1.isDataLoadRequest(hook)) {
            if (hook.registerException)
                this.exceptions.forEach(function (exception) { return hook.registerException(exception); });
            if (this.loading && hook.markIsLoading)
                hook.markIsLoading();
        }
    };
    /**
     * Retrieves the value of a source
     * @param hook Data to hook into the meta state and to notify about state changes
     * @returns The value that's currently available
     */
    DataCacher.prototype.get = function (hook) {
        _super.prototype.addListener.call(this, hook);
        this.updateIfRequired(hook);
        this.forwardState(hook);
        return this.cached;
    };
    return DataCacher;
}(AbstractDataSource_1.AbstractDataSource));
exports.DataCacher = DataCacher;
//# sourceMappingURL=DataCacher.js.map