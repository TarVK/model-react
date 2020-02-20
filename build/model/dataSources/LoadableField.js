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
var Field_1 = require("./Field");
var defaultUpdater = function (newLoaded, previousLoaded, current) {
    return newLoaded === previousLoaded ? current : newLoaded;
};
var LoadableField = /** @class */ (function (_super) {
    __extends(LoadableField, _super);
    /**
     * Creates a new field that synchronizes with a data loader.
     * @param loader The loader to get the data from
     * @param updater A function to determine the new value of the field
     */
    function LoadableField(loader, updater) {
        if (updater === void 0) { updater = defaultUpdater; }
        var _this = _super.call(this, loader()) || this;
        _this.previousLoaded = undefined;
        _this.loader = loader;
        _this.updater = defaultUpdater;
        return _this;
    }
    /**
     * Retrieves the value of a source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The value that's currently available
     */
    LoadableField.prototype.get = function (params) {
        this.updatevalue(params);
        return _super.prototype.get.call(this, params);
    };
    /**
     * Retrieves the data from the loader,
     * and desides whether it should overwrite the field value
     * @param params Data used to know whether to reload and to notify about state changes
     */
    LoadableField.prototype.updatevalue = function (params) {
        var value = this.loader(params);
        this.value = this.updater(value, this.previousLoaded, this.value);
        this.previousLoaded = value;
    };
    return LoadableField;
}(Field_1.Field));
exports.LoadableField = LoadableField;
//# sourceMappingURL=LoadableField.js.map