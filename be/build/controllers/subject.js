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
exports.createSubject = exports.getAllSubject = exports.getAllSubjects = void 0;
const http_status_codes_1 = require("http-status-codes");
const error_1 = require("../middlewares/error");
const subject_1 = __importDefault(require("../model/subject"));
const getAllSubjects = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const subjects = yield subject_1.default.find({});
        res.status(200).json({
            message: "Lấy danh sách môn học thành công",
            data: subjects,
        });
    }
    catch (error) {
        res.status(500).json({ error: "Lỗi server" });
    }
});
exports.getAllSubjects = getAllSubjects;
const getAllSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _page = '1', _limit = '10', _sort = 'createdAt', _order = 'asc' } = req.query;
        const options = {
            page: parseInt(_page),
            limit: parseInt(_limit),
            sort: { [_sort]: _order === 'asc' ? 1 : -1 }
        };
        const subject = yield subject_1.default.paginate({}, options);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            status: "success",
            message: "Lấy danh sách môn học thành công",
            data: subject.docs,
            pagination: {
                totalDocs: subject.totalDocs,
                totalPages: subject.totalPages,
                page: subject.page,
                limit: subject.limit
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.getAllSubject = getAllSubject;
// export const getClassById = async (req: any, res: any) => {
//     try {
//         const data = await Class.findById(req.params.id).populate("MajorId");
//         if (!data) {
//             return res.status(StatusCodes.BAD_REQUEST).json({
//                 message: 'Not found'
//             })
//         }
//         return res.status(StatusCodes.OK).json({
//             message: 'Thành công',
//             data: data
//         })
//     } catch (error: unknown) {
//     }
// }
const createSubject = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield subject_1.default.create(req.body);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            data: data,
            message: 'Thành công',
            StatusCodes: http_status_codes_1.StatusCodes.OK
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.createSubject = createSubject;
// export const updateClass = async (req: Request, res: Response) => {
//     try {
//         const data = await Class.findByIdAndUpdate(req.params.id, req.body, {
//             new: true
//         });
//         if (!data) {
//              res.status(StatusCodes.BAD_REQUEST).json({
//                 message: 'Not found'
//             })
//         }
//         res.status(StatusCodes.OK).json({
//             message: 'Thành công',
//             data: data
//         })
//     } catch (error) {
//         handleError(res, error)
//     }
// }
// export const deleteClass = async (req: Request, res: any) => {
//     try {
//         const data = await Class.findByIdAndDelete(req.params.id);
//         if (!data) {
//             return res.status(StatusCodes.BAD_REQUEST).json({
//                 message: 'Not found'
//             })
//         }
//         res.status(StatusCodes.OK).json({
//             message: 'Thành công',
//         })
//     } catch (error) {
//         handleError(res, error)
//     }
// }
