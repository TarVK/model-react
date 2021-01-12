"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.waitFor = void 0;
const getAsync_1 = require("./getAsync");
/**
 * Waits for a condition to become true
 * @param condition The getter to get the condition result from
 * @returns A promise that resolves once the condition is met
 */
const waitFor = (condition) => __awaiter(void 0, void 0, void 0, function* () {
    return getAsync_1.getAsync(h => {
        var _a;
        if (!condition(h))
            (_a = h.markIsLoading) === null || _a === void 0 ? void 0 : _a.call(h);
    });
});
exports.waitFor = waitFor;
//# sourceMappingURL=waitFor.js.map