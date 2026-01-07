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
exports.AdminGetPayments = exports.GetStudentByMajor = exports.GetEnrollmentBySemester = exports.GetAdminSumary = void 0;
const error_1 = require("../middlewares/error");
const student_1 = __importDefault(require("../model/student"));
const teacher_1 = __importDefault(require("../model/teacher"));
const subject_1 = __importDefault(require("../model/subject"));
const class_1 = __importDefault(require("../model/class"));
const enrollment_1 = __importDefault(require("../model/enrollment"));
const http_status_codes_1 = require("http-status-codes");
const GetAdminSumary = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [student, teacher, subject, classcount, enrollmentcount] = yield Promise.all([
            student_1.default.countDocuments(),
            teacher_1.default.countDocuments(),
            subject_1.default.countDocuments(),
            class_1.default.countDocuments(),
            enrollment_1.default.countDocuments()
        ]);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: {
                student,
                teacher,
                subject,
                class: classcount,
                enrollment: enrollmentcount,
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.GetAdminSumary = GetAdminSumary;
const GetEnrollmentBySemester = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield enrollment_1.default.aggregate([
            { $match: { status: 'Approved' } },
            {
                $lookup: {
                    from: 'teachingassignments',
                    localField: 'teaching_assignment_id',
                    foreignField: '_id',
                    as: 'teaching'
                }
            },
            { $unwind: '$teaching' },
            {
                $lookup: {
                    from: 'students',
                    localField: 'student_id',
                    foreignField: '_id',
                    as: 'student'
                }
            },
            { $unwind: '$student' },
            {
                $lookup: {
                    from: 'majors',
                    localField: 'student.major_id',
                    foreignField: '_id',
                    as: 'major'
                }
            },
            { $unwind: '$major' },
            {
                $lookup: {
                    from: 'semesters',
                    localField: 'teaching.semester_id',
                    foreignField: '_id',
                    as: 'semester'
                }
            },
            { $unwind: '$semester' },
            {
                $group: {
                    _id: {
                        semester: '$semester.name',
                        major: '$major.name'
                    },
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    _id: 0,
                    semester: '$_id.semester',
                    major: '$_id.major',
                    count: 1
                }
            },
            { $sort: { semester: 1, major: 1 } }
        ]);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: result
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.GetEnrollmentBySemester = GetEnrollmentBySemester;
const GetStudentByMajor = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield student_1.default.aggregate([
            {
                $lookup: {
                    from: 'majors',
                    localField: 'major_id',
                    foreignField: '_id',
                    as: 'major'
                }
            },
            { $unwind: '$major' },
            {
                $group: {
                    _id: '$major.name',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);
        res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: result.map(item => ({
                major: item._id,
                count: item.count
            }))
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.GetStudentByMajor = GetStudentByMajor;
const AdminGetPayments = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { classId, subjectId, semesterId, page = "1", limit = "10" } = req.query;
        const pageNumber = parseInt(page, 10);
        const pageSize = parseInt(limit, 10);
        const query = {};
        if (classId)
            query["teaching_assignment_id.class_id"] = classId;
        if (subjectId)
            query["teaching_assignment_id.subject_id"] = subjectId;
        if (semesterId)
            query["teaching_assignment_id.semester_id"] = semesterId;
        const totalDocs = yield enrollment_1.default.countDocuments(query);
        const enrollments = yield enrollment_1.default.find(query)
            .populate({
            path: "student_id",
            select: "name StudentCode classId",
        })
            .populate({
            path: "teaching_assignment_id",
            populate: [
                { path: "subject_id", select: "name tuitionFee" },
                { path: "class_id", select: "ClassName" },
                { path: "semester_id", select: "name" },
                { path: "teacher_id", select: "name" },
            ],
        })
            .skip((pageNumber - 1) * pageSize)
            .limit(pageSize);
        const result = enrollments.map((e) => {
            var _a, _b, _c, _d, _e, _f, _g, _h;
            return ({
                studentName: (_a = e.student_id) === null || _a === void 0 ? void 0 : _a.name,
                studentCode: (_b = e.student_id) === null || _b === void 0 ? void 0 : _b.StudentCode,
                className: (_d = (_c = e.teaching_assignment_id) === null || _c === void 0 ? void 0 : _c.class_id) === null || _d === void 0 ? void 0 : _d.ClassName,
                subjectName: (_f = (_e = e.teaching_assignment_id) === null || _e === void 0 ? void 0 : _e.subject_id) === null || _f === void 0 ? void 0 : _f.name,
                tuitionFee: ((_h = (_g = e.teaching_assignment_id) === null || _g === void 0 ? void 0 : _g.subject_id) === null || _h === void 0 ? void 0 : _h.tuitionFee) || 0,
                status: e.status,
            });
        });
        const totalPages = Math.ceil(totalDocs / pageSize);
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            status: http_status_codes_1.StatusCodes.OK,
            message: "Thành công",
            data: {
                data: result,
                pagination: {
                    totalDocs,
                    totalPages,
                    page: pageNumber,
                    limit: pageSize,
                },
            },
            StatusCodes: http_status_codes_1.StatusCodes.OK,
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.AdminGetPayments = AdminGetPayments;
