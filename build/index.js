(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("react"));
	else if(typeof define === 'function' && define.amd)
		define(["react"], factory);
	else if(typeof exports === 'object')
		exports["library"] = factory(require("react"));
	else
		root["library"] = factory(root["react"]);
})(window, function(__WEBPACK_EXTERNAL_MODULE_react__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! exports provided: isDataListener, isDataLoadRequest, getAsync, useDataHook, AbstractDataSource, DataLoader, Field, LoadableField, LoaderSwitch, Loader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _model_types_IDataListener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./model/_types/IDataListener */ \"./src/model/_types/IDataListener.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"isDataListener\", function() { return _model_types_IDataListener__WEBPACK_IMPORTED_MODULE_0__[\"isDataListener\"]; });\n\n/* harmony import */ var _model_types_IDataLoadRequest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./model/_types/IDataLoadRequest */ \"./src/model/_types/IDataLoadRequest.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"isDataLoadRequest\", function() { return _model_types_IDataLoadRequest__WEBPACK_IMPORTED_MODULE_1__[\"isDataLoadRequest\"]; });\n\n/* harmony import */ var _model_dataRetrievers_getAsync__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./model/dataRetrievers/getAsync */ \"./src/model/dataRetrievers/getAsync.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"getAsync\", function() { return _model_dataRetrievers_getAsync__WEBPACK_IMPORTED_MODULE_2__[\"getAsync\"]; });\n\n/* harmony import */ var _model_dataRetrievers_useDataHook__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./model/dataRetrievers/useDataHook */ \"./src/model/dataRetrievers/useDataHook.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"useDataHook\", function() { return _model_dataRetrievers_useDataHook__WEBPACK_IMPORTED_MODULE_3__[\"useDataHook\"]; });\n\n/* harmony import */ var _model_dataSources_AbstractDataSource__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./model/dataSources/AbstractDataSource */ \"./src/model/dataSources/AbstractDataSource.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"AbstractDataSource\", function() { return _model_dataSources_AbstractDataSource__WEBPACK_IMPORTED_MODULE_4__[\"AbstractDataSource\"]; });\n\n/* harmony import */ var _model_dataSources_DataLoader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./model/dataSources/DataLoader */ \"./src/model/dataSources/DataLoader.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"DataLoader\", function() { return _model_dataSources_DataLoader__WEBPACK_IMPORTED_MODULE_5__[\"DataLoader\"]; });\n\n/* harmony import */ var _model_dataSources_Field__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./model/dataSources/Field */ \"./src/model/dataSources/Field.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Field\", function() { return _model_dataSources_Field__WEBPACK_IMPORTED_MODULE_6__[\"Field\"]; });\n\n/* harmony import */ var _model_dataSources_LoadableField__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./model/dataSources/LoadableField */ \"./src/model/dataSources/LoadableField.ts\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"LoadableField\", function() { return _model_dataSources_LoadableField__WEBPACK_IMPORTED_MODULE_7__[\"LoadableField\"]; });\n\n/* harmony import */ var _tools_Loader__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./tools/Loader */ \"./src/tools/Loader.tsx\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"Loader\", function() { return _tools_Loader__WEBPACK_IMPORTED_MODULE_8__[\"Loader\"]; });\n\n/* harmony import */ var _tools_LoaderSwitch__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./tools/LoaderSwitch */ \"./src/tools/LoaderSwitch.tsx\");\n/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, \"LoaderSwitch\", function() { return _tools_LoaderSwitch__WEBPACK_IMPORTED_MODULE_9__[\"LoaderSwitch\"]; });\n\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\n\n//# sourceURL=webpack://library/./src/index.ts?");

/***/ }),

/***/ "./src/model/_types/IDataListener.ts":
/*!*******************************************!*\
  !*** ./src/model/_types/IDataListener.ts ***!
  \*******************************************/
/*! exports provided: isDataListener */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isDataListener\", function() { return isDataListener; });\n/**\r\n * Checks whether the given data satisfies the data listener constraints\r\n * @param data The data to check\r\n * @returns Whether the data represents a listener\r\n */\r\nvar isDataListener = function (data) {\r\n    return data && data.call !== undefined && data.registerRemover instanceof Function;\r\n};\r\n\n\n//# sourceURL=webpack://library/./src/model/_types/IDataListener.ts?");

/***/ }),

/***/ "./src/model/_types/IDataLoadRequest.ts":
/*!**********************************************!*\
  !*** ./src/model/_types/IDataLoadRequest.ts ***!
  \**********************************************/
/*! exports provided: isDataLoadRequest */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"isDataLoadRequest\", function() { return isDataLoadRequest; });\n/**\r\n * Checks whether the given data satisfies the data load request constraints\r\n * @param data The data to check\r\n * @returns Whether the data represents a data load request\r\n */\r\nvar isDataLoadRequest = function (data) {\r\n    return data &&\r\n        (data.refreshData === undefined ||\r\n            data.registerException instanceof Function ||\r\n            data.markShouldRefresh instanceof Function);\r\n};\r\n\n\n//# sourceURL=webpack://library/./src/model/_types/IDataLoadRequest.ts?");

/***/ }),

/***/ "./src/model/dataRetrievers/getAsync.ts":
/*!**********************************************!*\
  !*** ./src/model/dataRetrievers/getAsync.ts ***!
  \**********************************************/
/*! exports provided: getAsync */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"getAsync\", function() { return getAsync; });\nvar __assign = (undefined && undefined.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nvar __generator = (undefined && undefined.__generator) || function (thisArg, body) {\r\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\r\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\r\n    function verb(n) { return function (v) { return step([n, v]); }; }\r\n    function step(op) {\r\n        if (f) throw new TypeError(\"Generator is already executing.\");\r\n        while (_) try {\r\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\r\n            if (y = 0, t) op = [op[0] & 2, t.value];\r\n            switch (op[0]) {\r\n                case 0: case 1: t = op; break;\r\n                case 4: _.label++; return { value: op[1], done: false };\r\n                case 5: _.label++; y = op[1]; op = [0]; continue;\r\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\r\n                default:\r\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\r\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\r\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\r\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\r\n                    if (t[2]) _.ops.pop();\r\n                    _.trys.pop(); continue;\r\n            }\r\n            op = body.call(thisArg, _);\r\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\r\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\r\n    }\r\n};\r\nvar _this = undefined;\r\n/**\r\n * Transforms a normal data getter into a promise that resolves when the data is loaded\r\n * @param getter The getter function call, which applies the hook\r\n * @param refreshTimestamp The oldest allowed time for data to have been loaded without requiring a refresh\r\n * @returns A promise with the result after all data sources finished loading/refreshing\r\n */\r\nvar getAsync = function (getter, refreshTimestamp) { return __awaiter(_this, void 0, void 0, function () {\r\n    return __generator(this, function (_a) {\r\n        return [2 /*return*/, new Promise(function (res, rej) {\r\n                /**\r\n                 * Performs a data poll, and return the data if it's up to data,\r\n                 * otherwise wait for changes\r\n                 */\r\n                var poll = function () {\r\n                    // Variables to keep track of the state of this poll\r\n                    var listenerRemovers = [];\r\n                    var removeListeners = function () { return listenerRemovers.forEach(function (remove) { return remove(); }); };\r\n                    var isRefreshing = false;\r\n                    var exceptions = [];\r\n                    // Perform the poll\r\n                    var result = getter(__assign({ call: function () {\r\n                            removeListeners();\r\n                            // Poll again if any state changed\r\n                            poll();\r\n                        },\r\n                        registerRemover: function (remover) {\r\n                            listenerRemovers.push(remover);\r\n                        },\r\n                        markShouldRefresh: function () {\r\n                            isRefreshing = true;\r\n                        }, refreshData: true, registerException: function (exception) {\r\n                            exceptions.push(exception);\r\n                        } }, (refreshTimestamp !== undefined && {\r\n                        refreshTimestamp: refreshTimestamp,\r\n                    })));\r\n                    // Check if there are any exceptions\r\n                    if (exceptions.length) {\r\n                        removeListeners();\r\n                        rej(exceptions);\r\n                    }\r\n                    // Check whether the retrieved data was up to date\r\n                    else if (!isRefreshing) {\r\n                        removeListeners();\r\n                        res(result);\r\n                    }\r\n                };\r\n                // Perform the initial call\r\n                poll();\r\n            })];\r\n    });\r\n}); };\r\n\n\n//# sourceURL=webpack://library/./src/model/dataRetrievers/getAsync.ts?");

/***/ }),

/***/ "./src/model/dataRetrievers/useDataHook.ts":
/*!*************************************************!*\
  !*** ./src/model/dataRetrievers/useDataHook.ts ***!
  \*************************************************/
/*! exports provided: useDataHook */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"useDataHook\", function() { return useDataHook; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\nvar __assign = (undefined && undefined.__assign) || function () {\r\n    __assign = Object.assign || function(t) {\r\n        for (var s, i = 1, n = arguments.length; i < n; i++) {\r\n            s = arguments[i];\r\n            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))\r\n                t[p] = s[p];\r\n        }\r\n        return t;\r\n    };\r\n    return __assign.apply(this, arguments);\r\n};\r\n\r\n/**\r\n * Retrieves a hook that can be used to listen to data from data sources, such that the component rerenders upon data changes.\r\n * As well a function to determine whether the data is still loading\r\n * @param forceRefreshTime The time such that if data is loader, it will be refreshed\r\n * @returns The data hook followed by contextual data\r\n */\r\nvar useDataHook = function (refreshTime) {\r\n    // A fake state in order to fore an update\r\n    var _a = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useState\"])(), update = _a[1];\r\n    // A variable to track whether any retrieved data is refreshing, and exceptions\r\n    var isRefreshing;\r\n    var exceptions = [];\r\n    // A list of functions to call to remove the passed listener as a dependency\r\n    var dependencyRemovers = Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useRef\"])([]);\r\n    // Remove all dependencies when the element is removed or remerendered\r\n    dependencyRemovers.current.forEach(function (remove) { return remove(); });\r\n    Object(react__WEBPACK_IMPORTED_MODULE_0__[\"useEffect\"])(function () { return function () { return dependencyRemovers.current.forEach(function (remove) { return remove(); }); }; }, []);\r\n    return [\r\n        __assign({ call: function () {\r\n                update({});\r\n            },\r\n            registerRemover: function (remover) {\r\n                dependencyRemovers.current.push(remover);\r\n            }, refreshData: true, markShouldRefresh: function () {\r\n                isRefreshing = true;\r\n            },\r\n            registerException: function (exception) {\r\n                exceptions.push(exception);\r\n            } }, (refreshTime !== undefined && { refreshTime: refreshTime })),\r\n        // Return the function that retrieves if any data is refreshing\r\n        { isLoading: function () { return isRefreshing; }, getExceptions: function () { return exceptions; } },\r\n    ];\r\n};\r\n\n\n//# sourceURL=webpack://library/./src/model/dataRetrievers/useDataHook.ts?");

/***/ }),

/***/ "./src/model/dataSources/AbstractDataSource.ts":
/*!*****************************************************!*\
  !*** ./src/model/dataSources/AbstractDataSource.ts ***!
  \*****************************************************/
/*! exports provided: AbstractDataSource */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"AbstractDataSource\", function() { return AbstractDataSource; });\n/* harmony import */ var _types_IDataListener__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../_types/IDataListener */ \"./src/model/_types/IDataListener.ts\");\n\r\nvar AbstractDataSource = /** @class */ (function () {\r\n    function AbstractDataSource() {\r\n        // Data liseteners to notify when data has changed\r\n        this.listeners = [];\r\n    }\r\n    /**\r\n     * Adds a listener for this field\r\n     * @param listener The listener to add\r\n     */\r\n    AbstractDataSource.prototype.addListener = function (listener) {\r\n        var _this = this;\r\n        if (Object(_types_IDataListener__WEBPACK_IMPORTED_MODULE_0__[\"isDataListener\"])(listener) && this.listeners.indexOf(listener) === -1) {\r\n            this.listeners.push(listener);\r\n            listener.registerRemover(function () {\r\n                var index = _this.listeners.indexOf(listener);\r\n                if (index !== -1)\r\n                    _this.listeners.splice(index, 1);\r\n            });\r\n        }\r\n    };\r\n    /**\r\n     * Signals all listeners that data has been altered\r\n     */\r\n    AbstractDataSource.prototype.callListeners = function () {\r\n        var listenersCopy = this.listeners.slice();\r\n        listenersCopy.forEach(function (listener) { return listener.call(); });\r\n    };\r\n    return AbstractDataSource;\r\n}());\r\n\r\n\n\n//# sourceURL=webpack://library/./src/model/dataSources/AbstractDataSource.ts?");

/***/ }),

/***/ "./src/model/dataSources/DataLoader.ts":
/*!*********************************************!*\
  !*** ./src/model/dataSources/DataLoader.ts ***!
  \*********************************************/
/*! exports provided: DataLoader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"DataLoader\", function() { return DataLoader; });\n/* harmony import */ var _AbstractDataSource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractDataSource */ \"./src/model/dataSources/AbstractDataSource.ts\");\n/* harmony import */ var _types_IDataLoadRequest__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../_types/IDataLoadRequest */ \"./src/model/_types/IDataLoadRequest.ts\");\nvar __extends = (undefined && undefined.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\nvar __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {\r\n    return new (P || (P = Promise))(function (resolve, reject) {\r\n        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }\r\n        function rejected(value) { try { step(generator[\"throw\"](value)); } catch (e) { reject(e); } }\r\n        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }\r\n        step((generator = generator.apply(thisArg, _arguments || [])).next());\r\n    });\r\n};\r\nvar __generator = (undefined && undefined.__generator) || function (thisArg, body) {\r\n    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;\r\n    return g = { next: verb(0), \"throw\": verb(1), \"return\": verb(2) }, typeof Symbol === \"function\" && (g[Symbol.iterator] = function() { return this; }), g;\r\n    function verb(n) { return function (v) { return step([n, v]); }; }\r\n    function step(op) {\r\n        if (f) throw new TypeError(\"Generator is already executing.\");\r\n        while (_) try {\r\n            if (f = 1, y && (t = op[0] & 2 ? y[\"return\"] : op[0] ? y[\"throw\"] || ((t = y[\"return\"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;\r\n            if (y = 0, t) op = [op[0] & 2, t.value];\r\n            switch (op[0]) {\r\n                case 0: case 1: t = op; break;\r\n                case 4: _.label++; return { value: op[1], done: false };\r\n                case 5: _.label++; y = op[1]; op = [0]; continue;\r\n                case 7: op = _.ops.pop(); _.trys.pop(); continue;\r\n                default:\r\n                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }\r\n                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }\r\n                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }\r\n                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }\r\n                    if (t[2]) _.ops.pop();\r\n                    _.trys.pop(); continue;\r\n            }\r\n            op = body.call(thisArg, _);\r\n        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }\r\n        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };\r\n    }\r\n};\r\n\r\n\r\nvar DataLoader = /** @class */ (function (_super) {\r\n    __extends(DataLoader, _super);\r\n    /**\r\n     * Creates a new data loader instance\r\n     * @param loader The function to load the data with\r\n     * @param initial The initial value of the data\r\n     * @param dirty Whether the initial value should be overwritten when any data is request\r\n     * @param loadImmediately Whether the data should already be fetched despite not having been requested yet\r\n     */\r\n    function DataLoader(loader, initial, dirty, loadImmediately) {\r\n        if (dirty === void 0) { dirty = true; }\r\n        if (loadImmediately === void 0) { loadImmediately = false; }\r\n        var _this = _super.call(this) || this;\r\n        // The timestamp at which the loader was last called\r\n        _this.lastLoadTime = 0;\r\n        // Whether the loader is currently loading data\r\n        _this.loading = false;\r\n        _this.loader = loader;\r\n        _this.data = initial;\r\n        _this.dirty = dirty;\r\n        if (loadImmediately)\r\n            _this.load();\r\n        return _this;\r\n    }\r\n    /**\r\n     * Retrieves the data of a source\r\n     * @param params Data used to know whether to reload and to notify about state changes\r\n     * @returns The data that's currently available\r\n     */\r\n    DataLoader.prototype.get = function (params) {\r\n        _super.prototype.addListener.call(this, params);\r\n        // Handle any load request\r\n        if (Object(_types_IDataLoadRequest__WEBPACK_IMPORTED_MODULE_1__[\"isDataLoadRequest\"])(params))\r\n            this.handleDataLoadRequest(params);\r\n        // Return the current data\r\n        return this.data;\r\n    };\r\n    /**\r\n     * Handles a data load request\r\n     * @param request The request to handle\r\n     */\r\n    DataLoader.prototype.handleDataLoadRequest = function (request) {\r\n        // Check whether we should refresh the data\r\n        var shouldRefresh = this.dirty ||\r\n            this.loading ||\r\n            (request.refreshTimestamp && request.refreshTimestamp > this.lastLoadTime);\r\n        if (shouldRefresh) {\r\n            if (request.markShouldRefresh)\r\n                request.markShouldRefresh();\r\n            if (request.refreshData)\r\n                this.load();\r\n        }\r\n        // Forward exceptions\r\n        if (this.exception && request.registerException)\r\n            request.registerException(this.exception);\r\n    };\r\n    /**\r\n     * Fetches the data from the api\r\n     */\r\n    DataLoader.prototype.load = function () {\r\n        return __awaiter(this, void 0, void 0, function () {\r\n            var _a, e_1;\r\n            return __generator(this, function (_b) {\r\n                switch (_b.label) {\r\n                    case 0:\r\n                        if (!!this.loading) return [3 /*break*/, 5];\r\n                        this.lastLoadTime = Date.now();\r\n                        this.loading = true;\r\n                        _b.label = 1;\r\n                    case 1:\r\n                        _b.trys.push([1, 3, , 4]);\r\n                        _a = this;\r\n                        return [4 /*yield*/, this.loader()];\r\n                    case 2:\r\n                        _a.data = _b.sent();\r\n                        this.exception = undefined;\r\n                        return [3 /*break*/, 4];\r\n                    case 3:\r\n                        e_1 = _b.sent();\r\n                        this.exception = e_1;\r\n                        return [3 /*break*/, 4];\r\n                    case 4:\r\n                        this.loading = false;\r\n                        this.dirty = false;\r\n                        this.callListeners();\r\n                        _b.label = 5;\r\n                    case 5: return [2 /*return*/];\r\n                }\r\n            });\r\n        });\r\n    };\r\n    /**\r\n     * Indicates that this data is no longer up to data and should be checked\r\n     */\r\n    DataLoader.prototype.markDirty = function () {\r\n        this.dirty = true;\r\n        this.callListeners();\r\n    };\r\n    return DataLoader;\r\n}(_AbstractDataSource__WEBPACK_IMPORTED_MODULE_0__[\"AbstractDataSource\"]));\r\n\r\n\n\n//# sourceURL=webpack://library/./src/model/dataSources/DataLoader.ts?");

/***/ }),

/***/ "./src/model/dataSources/Field.ts":
/*!****************************************!*\
  !*** ./src/model/dataSources/Field.ts ***!
  \****************************************/
/*! exports provided: Field */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Field\", function() { return Field; });\n/* harmony import */ var _AbstractDataSource__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./AbstractDataSource */ \"./src/model/dataSources/AbstractDataSource.ts\");\nvar __extends = (undefined && undefined.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\n\r\nvar Field = /** @class */ (function (_super) {\r\n    __extends(Field, _super);\r\n    /**\r\n     * Creates a new field\r\n     * @param value The initial value of the field\r\n     */\r\n    function Field(value) {\r\n        var _this = _super.call(this) || this;\r\n        _this.value = value;\r\n        return _this;\r\n    }\r\n    /**\r\n     * Retrieves the value of a source\r\n     * @param params Data used to know whether to reload and to notify about state changes\r\n     * @returns The value that's currently available\r\n     */\r\n    Field.prototype.get = function (params) {\r\n        _super.prototype.addListener.call(this, params);\r\n        return this.value;\r\n    };\r\n    /**\r\n     * Sets the new value of the field\r\n     * @param value The new value\r\n     */\r\n    Field.prototype.set = function (value) {\r\n        this.value = value;\r\n        this.callListeners();\r\n    };\r\n    return Field;\r\n}(_AbstractDataSource__WEBPACK_IMPORTED_MODULE_0__[\"AbstractDataSource\"]));\r\n\r\n\n\n//# sourceURL=webpack://library/./src/model/dataSources/Field.ts?");

/***/ }),

/***/ "./src/model/dataSources/LoadableField.ts":
/*!************************************************!*\
  !*** ./src/model/dataSources/LoadableField.ts ***!
  \************************************************/
/*! exports provided: LoadableField */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"LoadableField\", function() { return LoadableField; });\n/* harmony import */ var _Field__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Field */ \"./src/model/dataSources/Field.ts\");\nvar __extends = (undefined && undefined.__extends) || (function () {\r\n    var extendStatics = function (d, b) {\r\n        extendStatics = Object.setPrototypeOf ||\r\n            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||\r\n            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };\r\n        return extendStatics(d, b);\r\n    };\r\n    return function (d, b) {\r\n        extendStatics(d, b);\r\n        function __() { this.constructor = d; }\r\n        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());\r\n    };\r\n})();\r\n\r\nvar defaultUpdater = function (newLoaded, previousLoaded, current) {\r\n    return newLoaded === previousLoaded ? current : newLoaded;\r\n};\r\nvar LoadableField = /** @class */ (function (_super) {\r\n    __extends(LoadableField, _super);\r\n    /**\r\n     * Creates a new field that synchronizes with a data loader.\r\n     * @param loader The loader to get the data from\r\n     * @param updater A function\r\n     */\r\n    function LoadableField(loader, updater) {\r\n        if (updater === void 0) { updater = defaultUpdater; }\r\n        var _this = _super.call(this, loader()) || this;\r\n        _this.previousLoaded = undefined;\r\n        _this.loader = loader;\r\n        _this.updater = defaultUpdater;\r\n        return _this;\r\n    }\r\n    /**\r\n     * Retrieves the value of a source\r\n     * @param params Data used to know whether to reload and to notify about state changes\r\n     * @returns The value that's currently available\r\n     */\r\n    LoadableField.prototype.get = function (params) {\r\n        this.updatevalue(params);\r\n        return _super.prototype.get.call(this, params);\r\n    };\r\n    /**\r\n     * Retrieves the data from the loader,\r\n     * and desides whether it should overwrite the field value\r\n     * @param params Data used to know whether to reload and to notify about state changes\r\n     */\r\n    LoadableField.prototype.updatevalue = function (params) {\r\n        var value = this.loader(params);\r\n        this.value = this.updater(value, this.previousLoaded, this.value);\r\n        this.previousLoaded = value;\r\n    };\r\n    return LoadableField;\r\n}(_Field__WEBPACK_IMPORTED_MODULE_0__[\"Field\"]));\r\n\r\n\n\n//# sourceURL=webpack://library/./src/model/dataSources/LoadableField.ts?");

/***/ }),

/***/ "./src/tools/Loader.tsx":
/*!******************************!*\
  !*** ./src/tools/Loader.tsx ***!
  \******************************/
/*! exports provided: Loader */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"Loader\", function() { return Loader; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n/* harmony import */ var _model_dataRetrievers_useDataHook__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../model/dataRetrievers/useDataHook */ \"./src/model/dataRetrievers/useDataHook.ts\");\n\r\n\r\nvar Loader = function (_a) {\r\n    var \r\n    /** An alias for content */\r\n    children = _a.children, \r\n    /** The content to show when there are no exceptions and data loaded */\r\n    content = _a.content, \r\n    /** The data to show while loading */\r\n    onLoad = _a.onLoad, \r\n    /** A function retrieving the data to show */\r\n    onError = _a.onError;\r\n    var _b = Object(_model_dataRetrievers_useDataHook__WEBPACK_IMPORTED_MODULE_1__[\"useDataHook\"])(), l = _b[0], _c = _b[1], isLoading = _c.isLoading, getExceptions = _c.getExceptions;\r\n    var result = (content || children || (function () { }))(l);\r\n    if (isLoading && isLoading())\r\n        return react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](react__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, onLoad instanceof Function ? onLoad() : onLoad);\r\n    if (getExceptions) {\r\n        var exceptions = getExceptions();\r\n        if (exceptions.length > 0)\r\n            return react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](react__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, onError instanceof Function ? onError(exceptions) : onError);\r\n    }\r\n    return react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](react__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, result);\r\n};\r\n\n\n//# sourceURL=webpack://library/./src/tools/Loader.tsx?");

/***/ }),

/***/ "./src/tools/LoaderSwitch.tsx":
/*!************************************!*\
  !*** ./src/tools/LoaderSwitch.tsx ***!
  \************************************/
/*! exports provided: LoaderSwitch */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"LoaderSwitch\", function() { return LoaderSwitch; });\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react */ \"react\");\n/* harmony import */ var react__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react__WEBPACK_IMPORTED_MODULE_0__);\n\r\nvar LoaderSwitch = function (_a) {\r\n    var \r\n    /** An alias for content */\r\n    children = _a.children, \r\n    /** The content to show when there are no exceptions and data loaded */\r\n    content = _a.content, \r\n    /** The data to show while loading */\r\n    onLoad = _a.onLoad, \r\n    /** A function retrieving the data to show */\r\n    onError = _a.onError, \r\n    /** Whether the data is currently loading */\r\n    isLoading = _a.isLoading, \r\n    /** A getter for the exceptions */\r\n    getExceptions = _a.getExceptions;\r\n    if (isLoading && isLoading() && onLoad)\r\n        return react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](react__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, onLoad instanceof Function ? onLoad() : onLoad);\r\n    if (getExceptions && onError) {\r\n        var exceptions = getExceptions();\r\n        if (exceptions.length > 0)\r\n            return react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](react__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, onError instanceof Function ? onError(exceptions) : onError);\r\n    }\r\n    return react__WEBPACK_IMPORTED_MODULE_0__[\"createElement\"](react__WEBPACK_IMPORTED_MODULE_0__[\"Fragment\"], null, (content || children));\r\n};\r\n\n\n//# sourceURL=webpack://library/./src/tools/LoaderSwitch.tsx?");

/***/ }),

/***/ "react":
/*!************************!*\
  !*** external "react" ***!
  \************************/
/*! no static exports found */
/***/ (function(module, exports) {

eval("module.exports = __WEBPACK_EXTERNAL_MODULE_react__;\n\n//# sourceURL=webpack://library/external_%22react%22?");

/***/ })

/******/ });
});