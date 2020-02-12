import { isDataListener } from "../_types/IDataListener";
var AbstractDataSource = /** @class */ (function () {
    function AbstractDataSource() {
        // Data liseteners to notify when data has changed
        this.listeners = [];
    }
    /**
     * Adds a listener for this field
     * @param listener The listener to add
     */
    AbstractDataSource.prototype.addListener = function (listener) {
        var _this = this;
        if (isDataListener(listener) && this.listeners.indexOf(listener) === -1) {
            this.listeners.push(listener);
            listener.registerRemover(function () {
                var index = _this.listeners.indexOf(listener);
                if (index !== -1)
                    _this.listeners.splice(index, 1);
            });
        }
    };
    /**
     * Signals all listeners that data has been altered
     */
    AbstractDataSource.prototype.callListeners = function () {
        var listenersCopy = this.listeners.slice();
        listenersCopy.forEach(function (listener) { return listener.call(); });
    };
    return AbstractDataSource;
}());
export { AbstractDataSource };
//# sourceMappingURL=AbstractDataSource.js.map