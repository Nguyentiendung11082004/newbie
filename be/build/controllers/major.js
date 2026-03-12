"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteMajor = exports.updateMajor = exports.createMajor = exports.getMajorById = exports.getAllMajor = void 0;
const error_1 = require("../middlewares/error");
const major_1 = __importDefault(require("../model/major"));
const http_status_codes_1 = require("http-status-codes");
const getAllMajor = async (req, res) => {
    try {
        const { page = '1', limit = '10', sort = 'createdAt', order = 'asc' } = req.query;
        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { [sort]: order === 'asc' ? 1 : -1 },
        };
        const major = await major_1.default.paginate({}, options);
        console.log("major", major);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: major.docs,
            pagination: {
                totalDocs: major.totalDocs,
                totalPages: major.totalPages,
                page: major.page,
                limit: major.limit
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
};
exports.getAllMajor = getAllMajor;
const getMajorById = async (req, res) => {
    try {
        const major = await major_1.default.findById(req.params.id);
        if (!major) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: 'Not found'
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: major
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
};
exports.getMajorById = getMajorById;
const createMajor = async (req, res) => {
    try {
        const major = await major_1.default.create(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Tạo thành công',
            data: major
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
};
exports.createMajor = createMajor;
const updateMajor = async (req, res) => {
    try {
        const major = await major_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!major) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: 'Not found',
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: major
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
};
exports.updateMajor = updateMajor;
const deleteMajor = async (req, res) => {
    try {
        const major = await major_1.default.findByIdAndDelete(req.params.id);
        if (!major) {
            res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                messsage: 'Not found'
            });
        }
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công'
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
};
exports.deleteMajor = deleteMajor;
