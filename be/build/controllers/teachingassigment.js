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
exports.DeleteTeachingAssignment = exports.UpdateTeachingAssignment = exports.GetTeachigngassmentById = exports.GetTeachingassment = exports.CreateTeachingAssignment = void 0;
const http_status_codes_1 = require("http-status-codes");
const error_1 = require("../middlewares/error");
const class_1 = __importDefault(require("../model/class"));
const subject_1 = __importDefault(require("../model/subject"));
const teacher_1 = __importDefault(require("../model/teacher"));
const teachingassignment_1 = __importDefault(require("../model/teachingassignment"));
const semester_1 = __importDefault(require("../model/semester"));
const dayOfWeekToNumber = (day) => {
    var _a;
    const daysMap = {
        'Chủ nhật': 0,
        'Thứ 2': 1,
        'Thứ 3': 2,
        'Thứ 4': 3,
        'Thứ 5': 4,
        'Thứ 6': 5,
        'Thứ 7': 6
    };
    return (_a = daysMap[day.trim()]) !== null && _a !== void 0 ? _a : 0;
};
const parseLocalDate = (dateStr) => {
    if (!dateStr || typeof dateStr !== "string") {
        throw new Error("Invalid startDate: " + dateStr);
    }
    const [year, month, day] = dateStr.split('-').map(Number);
    if (!year || !month || !day) {
        throw new Error("startDate format must be YYYY-MM-DD. Got: " + dateStr);
    }
    return new Date(year, month - 1, day);
};
const generateSchedule = (startDate, numberOfClasses, weeklySchedule) => {
    const schedule = [];
    let currentDate = parseLocalDate(startDate.split("T")[0]); // ✅ dùng local date
    let count = 0;
    while (count < numberOfClasses) {
        for (const slot of weeklySchedule) {
            const targetDay = dayOfWeekToNumber(slot.dayOfWeek);
            const tempDate = new Date(currentDate);
            // Move tempDate đến đúng thứ cần tìm trong tuần
            while (tempDate.getDay() !== targetDay) {
                tempDate.setDate(tempDate.getDate() + 1);
            }
            if (tempDate >= currentDate) {
                schedule.push({
                    date: tempDate.toLocaleDateString('en-CA'), // ✅ YYYY-MM-DD theo local time
                    startTime: slot.startTime,
                    endTime: slot.endTime,
                });
                count++;
                if (count >= numberOfClasses)
                    break;
            }
        }
        // Sang tuần tiếp theo
        currentDate.setDate(currentDate.getDate() + 7);
    }
    // Sắp xếp theo ngày tăng dần
    return schedule.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
const CreateTeachingAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { teacher_id, subject_id, class_id, semester_id, startDate, numberOfClasses, weeklySchedule, room } = req.body;
        if (!teacher_id || !subject_id || !class_id || !semester_id || !startDate || !numberOfClasses || !weeklySchedule) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: "Thiếu thông tin bắt buộc"
            });
        }
        if (!Array.isArray(weeklySchedule) || weeklySchedule.length === 0) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: "weeklySchedule phải là mảng và không được trống"
            });
        }
        const teacher = yield teacher_1.default.findById(teacher_id);
        if (!teacher) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "Giảng viên không tồn tại" });
        }
        const subject = yield subject_1.default.findById(subject_id);
        if (!subject) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "Môn học không tồn tại" });
        }
        const lop = yield class_1.default.findById(class_id);
        if (!lop) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "Lớp không tồn tại" });
        }
        const ky = yield semester_1.default.findById(semester_id);
        if (!ky) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({ message: "Kỳ không tồn tại" });
        }
        const generatedSchedule = generateSchedule(startDate, numberOfClasses, weeklySchedule);
        const newAssignment = yield teachingassignment_1.default.create({
            teacher_id,
            subject_id,
            class_id,
            semester_id,
            startDate,
            numberOfClasses,
            weeklySchedule,
            room,
            schedule: generatedSchedule
        });
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: "Tạo phân công giảng dạy thành công",
            data: newAssignment
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.CreateTeachingAssignment = CreateTeachingAssignment;
const GetTeachingassment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const techingassment = yield teachingassignment_1.default.find()
            .populate('teacher_id', 'name')
            .populate('subject_id', 'name')
            .populate('class_id', 'ClassName')
            .populate('semester_id', 'name')
            .exec();
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Thành công',
            data: techingassment
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.GetTeachingassment = GetTeachingassment;
const GetTeachigngassmentById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const data = yield teachingassignment_1.default.findById(id);
        //     .populate('teacher_id', 'name')
        //     .populate('subject_id', 'name')
        //     .populate('class_id', 'ClassName')
        //     .exec();
        // ;
        if (!data) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: 'Not found'
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            data: {
                message: 'Thành công',
                data: data
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.GetTeachigngassmentById = GetTeachigngassmentById;
const UpdateTeachingAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { id } = req.query;
        const data = yield teachingassignment_1.default.findByIdAndUpdate(id, req.body, {
            new: true
        });
        if (!data) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: 'Not found'
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            data: {
                message: 'Cập nhật thành công',
                data: data
            }
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.UpdateTeachingAssignment = UpdateTeachingAssignment;
const DeleteTeachingAssignment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield teachingassignment_1.default.findByIdAndDelete(req.params.id);
        if (!data) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: 'Not found'
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            message: 'Xoá hành công',
        });
    }
    catch (error) {
        (0, error_1.handleError)(res, error);
    }
});
exports.DeleteTeachingAssignment = DeleteTeachingAssignment;
