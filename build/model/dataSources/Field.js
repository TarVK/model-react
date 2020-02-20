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
var Field = /** @class */ (function (_super) {
    __extends(Field, _super);
    /**
     * Creates a new field
     * @param value The initial value of the field
     */
    function Field(value) {
        var _this = _super.call(this) || this;
        _this.value = value;
        return _this;
    }
    /**
     * Retrieves the value of a source
     * @param params Data used to know whether to reload and to notify about state changes
     * @returns The value that's currently available
     */
    Field.prototype.get = function (params) {
        _super.prototype.addListener.call(this, params);
        return this.value;
    };
    /**
     * Sets the new value of the field
     * @param value The new value
     */
    Field.prototype.set = function (value) {
        this.value = value;
        this.callListeners();
    };
    return Field;
}(AbstractDataSource_1.AbstractDataSource));
exports.Field = Field;
//# sourceMappingURL=Field.js.map