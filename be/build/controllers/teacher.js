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
exports.GetTeacherTimeTable = exports.GetClassesByTeacher = exports.getAllTeacher = void 0;
const error_1 = require("../middlewares/error");
const teacher_1 = __importDefault(require("../model/teacher"));
const http_status_codes_1 = require("http-status-codes");
const teachingassignment_1 = __importDefault(require("../model/teachingassignment"));
const mongoose_1 = require("mongoose");
const getAllTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { _page = '1', _limit = '10', _sort = 'createAt', _order = 'asc' } = req.query;
        const options = {
            page: parseInt(_page),
            limit: parseInt(_limit),
            sort: { [_sort]: _order === 'asc' ? 1 : -1 }
        };
        const teacher = yield teacher_1.default.paginate({}, options);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            data: {
                message: 'Thành công',
                data: teacher.docs,
                pagination: {
                    totalDocs: teacher.totalDocs,
                    totalPages: teacher.totalPages,
                    page: teacher.page,
                    limit: teacher.limit
                }
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.getAllTeacher = getAllTeacher;
const GetClassesByTeacher = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const { teacher_id } = req.body; // Nhận teacher_id từ params
        const teacher_id = req.user.userId;
        if (!teacher_id || !mongoose_1.Types.ObjectId.isValid(teacher_id)) {
            return res.status(400).json({ message: "teacher_id không hợp lệ" });
        }
        console.log("teacher_id", teacher_id);
        // Truy vấn tất cả phân công giảng dạy của giảng viên theo teacher_id
        const assignments = yield teachingassignment_1.default.find({ teacher_id })
            .populate('class_id') // Lấy tên lớp học từ class_id
            .populate('subject_id'); // Lấy thông tin môn học từ subject_id
        // Trả về dữ liệu lớp học giảng viên đang dạy
        res.status(200).json({
            message: 'Thành công',
            data: assignments
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.GetClassesByTeacher = GetClassesByTeacher;
const GetTeacherTimeTable = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const teacherId = req.user.userId;
        const { subjectId, classId, fromDate, toDate } = req.query;
        const query = {
            teacher_id: teacherId,
        };
        if (subjectId)
            query.subject_id = subjectId;
        if (classId)
            query.class_id = classId;
        if (fromDate && toDate) {
            const from = new Date(fromDate);
            const to = new Date(toDate);
            // Set giờ để lấy nguyên ngày
            from.setUTCHours(0, 0, 0, 0);
            to.setUTCHours(23, 59, 59, 999);
            query.startDate = { $gte: from, $lte: to };
        }
        // const assignments = await TeachingAssignment.find({
        //     teacher_id: teacherId,
        // }).populate([
        //     { path: 'subject_id', select: 'name' },
        //     { path: 'class_id', select: 'ClassName' }
        // ]);
        console.log("query", query);
        const assignments = yield teachingassignment_1.default.find(query).populate([
            { path: "subject_id", select: "name" },
            { path: "class_id", select: "ClassName" },
        ]);
        const timetable = assignments.map((assign) => ({
            teachingAssignmentId: assign._id,
            subject: {
                id: assign.subject_id._id,
                name: assign.subject_id.name
            },
            class: {
                id: assign.class_id._id,
                name: assign.class_id.ClassName
            },
            weeklySchedule: assign.weeklySchedule.map((s) => ({
                dayOfWeek: s.dayOfWeek,
                startTime: s.startTime,
                endTime: s.endTime,
                room: s.room
            })),
            dateRange: {
                start: assign.startDate,
                end: assign.endDate
            },
            room: assign.room
        }));
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Thành công",
            data: timetable
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.GetTeacherTimeTable = GetTeacherTimeTable;
