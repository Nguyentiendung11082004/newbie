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
exports.GetAllSemesters = void 0;
const error_1 = require("../middlewares/error");
const semester_1 = __importDefault(require("../model/semester"));
const http_status_codes_1 = require("http-status-codes");
const GetAllSemesters = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield semester_1.default.find();
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: data
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.GetAllSemesters = GetAllSemesters;
