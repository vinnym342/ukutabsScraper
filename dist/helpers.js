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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIncreamentingAxiosPages = exports.getAllPassingPromises = void 0;
const axios_1 = __importDefault(require("axios"));
const getAllPassingPromises = (promises) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield Promise.all(promises.map((p) => p.catch((e) => e)));
    return (promises = results.filter((result) => !(result instanceof Error)));
});
exports.getAllPassingPromises = getAllPassingPromises;
const getIncreamentingAxiosPages = (rootUrl) => __awaiter(void 0, void 0, void 0, function* () {
    let is404 = false;
    let i = 0;
    const axiosResponses = [];
    while (!is404) {
        i++;
        try {
            const response = yield axios_1.default.get(rootUrl + `page/${i}`);
            axiosResponses.push(response);
        }
        catch (e) {
            is404 = true;
            break;
        }
    }
    return axiosResponses;
});
exports.getIncreamentingAxiosPages = getIncreamentingAxiosPages;
//# sourceMappingURL=helpers.js.map