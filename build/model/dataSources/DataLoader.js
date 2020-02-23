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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var AbstractDataSource_1 = require("./AbstractDataSource");
var IDataLoadRequest_1 = require("../_types/IDataLoadRequest");
var DataLoader = /** @class */ (function (_super) {
    __extends(DataLoader, _super);
    /**
     * Creates a new data loader instance, used to create a data source for async data getters
     * @param loader The function to load the data with
     * @param initial The initial value of the data
     * @param dirty Whether the initial value should be overwritten when any data is requested
     * @param loadImmediately Whether the data should already be fetched despite not having been requested yet
     */
    function DataLoader(loader, initial, dirty, loadImmediately) {
        if (dirty === void 0) { dirty = true; }
        if (loadImmediately === void 0) { loadImmediately = false; }
        var _this = _super.call(this) || this;
        // The timestamp at which the loader was last called
        _this.lastLoadTime = 0;
        // Whether the loader is currently loading data
        _this.loading = false;
        _this.loader = loader;
        _this.data = initial;
        _this.dirty = dirty;
        if (loadImmediately)
            _this.load();
        return _this;
    }
    /**
     * Retrieves the data of a source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The data that's currently available
     */
    DataLoader.prototype.get = function (params) {
        _super.prototype.addListener.call(this, params);
        // Handle any load request
        if (IDataLoadRequest_1.isDataLoadRequest(params))
            this.handleDataLoadRequest(params);
        // Return the current data
        return this.data;
    };
    /**
     * Handles a data load request
     * @param request The request to handle
     */
    DataLoader.prototype.handleDataLoadRequest = function (request) {
        // Check whether we should refresh the data
        var shouldRefresh = this.dirty ||
            this.loading ||
            (request.refreshTimestamp && request.refreshTimestamp > this.lastLoadTime);
        if (shouldRefresh) {
            if (request.markShouldRefresh)
                request.markShouldRefresh();
            if (request.refreshData)
                this.load();
        }
        // Forward exceptions
        if (this.exception && request.registerException)
            request.registerException(this.exception);
    };
    /**
     * Fetches the data from the api
     */
    DataLoader.prototype.load = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, e_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        if (!!this.loading) return [3 /*break*/, 5];
                        // Update loading indicators
                        this.loading = true;
                        this.lastLoadTime = Date.now();
                        // Call listeners so they know we're loading
                        this.callListeners();
                        _b.label = 1;
                    case 1:
                        _b.trys.push([1, 3, , 4]);
                        _a = this;
                        return [4 /*yield*/, this.loader()];
                    case 2:
                        _a.data = _b.sent();
                        this.exception = undefined;
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _b.sent();
                        this.exception = e_1;
                        return [3 /*break*/, 4];
                    case 4:
                        // Update indicators
                        this.loading = false;
                        this.dirty = false;
                        // Call listeners to they know we're done loading
                        this.callListeners();
                        _b.label = 5;
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /**
     * Indicates that this data is no longer up to data and should be reloaded
     */
    DataLoader.prototype.markDirty = function () {
        this.dirty = true;
        this.callListeners();
    };
    return DataLoader;
}(AbstractDataSource_1.AbstractDataSource));
exports.DataLoader = DataLoader;
//# sourceMappingURL=DataLoader.js.map