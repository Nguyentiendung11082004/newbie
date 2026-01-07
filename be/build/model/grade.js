"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GradeStatus = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
var GradeStatus;
(function (GradeStatus) {
    GradeStatus["PASS"] = "pass";
    GradeStatus["FAIL"] = "fail";
    GradeStatus["PEDING"] = "pending";
})(GradeStatus || (exports.GradeStatus = GradeStatus = {}));
const GradeSchema = new mongoose_1.default.Schema({
    student_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    subject_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    class_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    semester_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Semester',
        required: true
    },
    teacher_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    processScore: {
        type: Number,
        required: true,
    },
    midtermScore: {
        type: Number,
        required: true,
    },
    finalScore: {
        type: Number,
        required: true,
    },
    averageScore: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
    }
}, {
    timestamps: true,
    versionKey: false
});
const Grade = mongoose_1.default.model("Grade", GradeSchema);
exports.default = Grade;
