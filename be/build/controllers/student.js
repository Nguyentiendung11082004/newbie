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
exports.getAllStudents = void 0;
const student_1 = __importDefault(require("../model/student"));
const http_status_codes_1 = require("http-status-codes");
const getAllStudents = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _page = 1, _limit = 10, _sort = "createdAt", _order = "asc" } = req.body;
        const options = {
            page: parseInt(_page),
            limit: parseInt(_limit),
            sort: { [_sort]: _order === 'asc' ? 1 : -1 }
        };
        const students = yield student_1.default.paginate({}, options);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: students.docs,
            pagination: {
                totalDocs: students.totalDocs,
                totalPages: students.totalPages,
                page: students.page,
                limit: students.limit
            }
        });
    }
    catch (error) {
        if (error instanceof Error) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: error.message });
        }
        else {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: 'Đã có lỗi xảy ra' });
        }
    }
});
exports.getAllStudents = getAllStudents;
