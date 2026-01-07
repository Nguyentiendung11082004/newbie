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
exports.GetMyGrades = exports.CreateGrade = exports.GetStudentListForGrading = void 0;
const error_1 = require("../middlewares/error");
const teachingassignment_1 = __importDefault(require("../model/teachingassignment"));
const mongoose_1 = __importDefault(require("mongoose"));
const http_status_codes_1 = require("http-status-codes");
const enrollment_1 = __importDefault(require("../model/enrollment"));
const grade_1 = __importDefault(require("../model/grade"));
const GetStudentListForGrading = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { class_id, subject_id, semester_id } = req.body;
        const { role, userId } = req.user;
        if (!class_id || !subject_id || !semester_id) {
            return res.status(400).json({
                message: 'Chưa đủ thông tin về class_id, subject_id, semester_id',
                StatusCodes: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
        // hàm kiểm tra xem có đúng giảng vên này dạy lớp này không
        const assignment = yield teachingassignment_1.default.findOne({
            class_id: new mongoose_1.default.Types.ObjectId(class_id),
            subject_id: new mongoose_1.default.Types.ObjectId(subject_id),
            semester_id: semester_id,
            teacher_id: userId,
        });
        if (!assignment) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: 'Bạn không được nhập điểm lớp này',
                StatusCodes: http_status_codes_1.StatusCodes.FORBIDDEN
            });
        }
        const enrollment = yield enrollment_1.default.find({
            teaching_assignment_id: assignment._id,
            status: 'Approved'
        }).populate('student_id', 'name StudentCode email');
        const grades = yield grade_1.default.find({
            class_id,
            subject_id,
            semester_id
        });
        const gradeMap = new Map();
        grades.forEach(g => {
            gradeMap.set(g.student_id.toString(), g);
        });
        const dataStudent = enrollment.map((e) => {
            var _a, _b, _c, _d, _e;
            const grade = gradeMap.get(e.student_id._id.toString());
            return {
                student_id: e.student_id._id,
                name: e.student_id.name,
                email: e.student_id.email,
                StudentCode: e.student_id.StudentCode,
                processScore: (_a = grade === null || grade === void 0 ? void 0 : grade.processScore) !== null && _a !== void 0 ? _a : null,
                midtermScore: (_b = grade === null || grade === void 0 ? void 0 : grade.midtermScore) !== null && _b !== void 0 ? _b : null,
                finalScore: (_c = grade === null || grade === void 0 ? void 0 : grade.finalScore) !== null && _c !== void 0 ? _c : null,
                averageScore: (_d = grade === null || grade === void 0 ? void 0 : grade.averageScore) !== null && _d !== void 0 ? _d : null,
                status: (_e = grade === null || grade === void 0 ? void 0 : grade.status) !== null && _e !== void 0 ? _e : null
            };
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Thành công",
            data: dataStudent,
            StatusCodes: http_status_codes_1.StatusCodes.OK
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.GetStudentListForGrading = GetStudentListForGrading;
const CreateGrade = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { class_id, subject_id, semester_id, grades } = req.body;
        const { userId: teacher_id } = req.user;
        if (!class_id || !subject_id || !semester_id || !grades || !Array.isArray(grades)) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Thiếu thông tin class_id, subject_id, semester hoặc danh sách grades.'
            });
        }
        const assignment = yield teachingassignment_1.default.findOne({
            class_id: new mongoose_1.default.Types.ObjectId(class_id),
            subject_id: new mongoose_1.default.Types.ObjectId(subject_id),
            semester_id: new mongoose_1.default.Types.ObjectId(semester_id),
            teacher_id: new mongoose_1.default.Types.ObjectId(teacher_id),
        });
        if (!assignment) {
            return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
                success: false,
                message: 'Bạn không được phép nhập điểm cho lớp hoặc môn học này trong học kỳ này.'
            });
        }
        const bulkGrades = [];
        for (const g of grades) {
            const { student_id, processScore, midtermScore, finalScore } = g;
            if (!student_id || processScore == null || midtermScore == null || finalScore == null) {
                continue;
            }
            const averageScore = parseFloat(((processScore * 0.3) +
                (midtermScore * 0.3) +
                (finalScore * 0.4)).toFixed(2));
            const filter = {
                student_id: new mongoose_1.default.Types.ObjectId(student_id),
                subject_id: new mongoose_1.default.Types.ObjectId(subject_id),
                semester_id: new mongoose_1.default.Types.ObjectId(semester_id),
            };
            const status = averageScore >= 5 ? 'pass' : 'fail';
            const update = {
                $set: {
                    class_id,
                    teacher_id,
                    semester_id,
                    processScore,
                    midtermScore,
                    finalScore,
                    averageScore,
                    status: status
                }
            };
            yield grade_1.default.updateOne(filter, update, { upsert: true });
        }
        const result = yield grade_1.default.insertMany(bulkGrades);
        return res.status(http_status_codes_1.StatusCodes.CREATED).json({
            StatusCodes: http_status_codes_1.StatusCodes.OK,
            message: 'Nhập điểm thành công.',
            data: result
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.CreateGrade = CreateGrade;
const GetMyGrades = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { subject_id, class_id } = req.body;
        const { userId } = req.user;
        const filter = {
            student_id: userId
        };
        if (subject_id) {
            filter.subject_id = subject_id;
        }
        if (class_id) {
            filter.class_id = class_id;
        }
        const grades = yield grade_1.default.find(filter)
            .populate('subject_id', 'name')
            .populate('class_id', 'name')
            .populate('teacher_id', 'name email')
            .populate('student_id', 'name email StudentCode');
        return res.status(200).json({
            success: true,
            message: 'Lấy bảng điểm thành công',
            data: grades
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.GetMyGrades = GetMyGrades;
