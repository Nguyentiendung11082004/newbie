"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
// collection lưu trữ dữ liệu điểm danh
const AttendanceSchema = new mongoose_1.default.Schema({
    teaching_assignment_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'TeachingAssignment',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    attendances: [
        {
            student_id: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'Student',
                required: true,
            },
            status: {
                type: String,
                enum: ['present', 'absent'],
                required: true,
            },
            note: {
                type: String,
                default: '',
            },
        },
    ],
}, {
    timestamps: true, versionKey: false
});
const Attendance = mongoose_1.default.model("Attendance", AttendanceSchema);
exports.default = Attendance;
