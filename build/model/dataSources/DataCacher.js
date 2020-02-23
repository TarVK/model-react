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
        // Status variables
        _this.loading = false;
        _this.lastLoadTime = 0;
        _this.source = source;
        return _this;
    }
    /**
     * Updates the data if there is no dependency yet, or if a newer freshTimestamp is supplied
     * @param params Data used to know whether to reload
     */
    DataCacher.prototype.updateIfRequired = function (params) {
        var _this = this;
        // Make sure we don't have a dependency already, unless we want to force reload
        var refreshTimestamp = IDataLoadRequest_1.isDataLoadRequest(params) &&
            params.refreshData &&
            params.refreshTimestamp > this.lastLoadTime &&
            params.refreshTimestamp;
        if (this.dependencyRemover && !refreshTimestamp)
            return;
        // If a change occurs, remove the previous dependency listener and call listeners
        var onChange = function () {
            if (!_this.dependencyRemover)
                return;
            _this.dependencyRemover();
            _this.dependencyRemover = undefined;
            _this.callListeners();
        };
        // Reset the data
        this.exceptions = [];
        this.loading = false;
        this.lastLoadTime = Date.now();
        // Setup the listener, and forward changes to our listeners
        this.cached = this.source({
            refreshData: true,
            refreshTimestamp: refreshTimestamp,
            call: onChange,
            markShouldRefresh: function () {
                _this.loading = true;
            },
            registerException: function (exception) {
                _this.exceptions.push(exception);
                onChange();
            },
            registerRemover: function (remover) {
                _this.dependencyRemover = remover;
            },
        }, this.cached);
    };
    /**
     * Forwards the state of the retriever being cached
     * @param params Data used to notify about state changes
     */
    DataCacher.prototype.forwardState = function (params) {
        if (IDataLoadRequest_1.isDataLoadRequest(params)) {
            if (params.registerException)
                this.exceptions.forEach(function (exception) { return params.registerException(exception); });
            if (this.loading && params.markShouldRefresh)
                params.markShouldRefresh();
        }
    };
    /**
     * Retrieves the data of a source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The data that's currently available
     */
    DataCacher.prototype.get = function (params) {
        _super.prototype.addListener.call(this, params);
        this.updateIfRequired(params);
        this.forwardState(params);
        return this.cached;
    };
    return DataCacher;
}(AbstractDataSource_1.AbstractDataSource));
exports.DataCacher = DataCacher;
//# sourceMappingURL=DataCacher.js.map