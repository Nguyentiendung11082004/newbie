"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TeachingAssignmentSchema = new mongoose_1.default.Schema({
    teacher_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Teacher',
        required: true,
    },
    course_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    class_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    semester: {
        type: String,
        required: true,
    }
}, {
    timestamps: true,
    versionKey: false
});
const TeachingAssignment = mongoose_1.default.model("TeachingAssignment", TeachingAssignmentSchema);
exports.default = TeachingAssignment;
