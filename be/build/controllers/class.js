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
exports.deleteClass = exports.updateClass = exports.createClass = exports.getClassById = exports.getAllClass = void 0;
const http_status_codes_1 = require("http-status-codes");
const class_1 = __importDefault(require("../model/class"));
const error_1 = require("../middlewares/error");
const getAllClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _page = '1', _limit = '10', _sort = 'createdAt', _order = 'asc' } = req.query;
        const options = {
            page: parseInt(_page),
            limit: parseInt(_limit),
            sort: { [_sort]: _order === 'asc' ? 1 : -1 }
        };
        const classs = yield class_1.default.paginate({}, options);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: classs.docs,
            pagination: {
                totalDocs: classs.totalDocs,
                totalPages: classs.totalPages,
                page: classs.page,
                limit: classs.limit
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.getAllClass = getAllClass;
const getClassById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield class_1.default.findById(req.params.id).populate("MajorId");
        if (!data) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: 'Not found'
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: data
        });
    }
    catch (error) {
    }
});
exports.getClassById = getClassById;
const createClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield class_1.default.create(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: data
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.createClass = createClass;
const updateClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield class_1.default.findByIdAndUpdate(req.params.id, req.body, {
            new: true
        });
        if (!data) {
            res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: 'Not found'
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: data
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.updateClass = updateClass;
const deleteClass = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield class_1.default.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: 'Not found'
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.deleteClass = deleteClass;
