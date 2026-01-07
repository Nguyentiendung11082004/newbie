"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
// collection đăng ký môn học
const EnrollmentSchema = new mongoose_1.default.Schema({
    student_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Student',
        required: true
    },
    teaching_assignment_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'TeachingAssignment',
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Approved', 'CancelledByStudent', 'Cancel'],
        default: 'Pending'
    },
    dueDate: { type: Date, required: true },
    reminderSentBefore: { type: Boolean, default: false },
    reminderSentAfter: { type: Boolean, default: false },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'cancelled_by_student', 'cancelled_by_admin'],
        default: 'pending'
    },
    enrolled_at: {
        type: Date,
        default: Date.now
    },
    course_schedule: {
        type: [{ dayOfWeek: String, startTime: String, endTime: String }],
        default: []
    },
    final_grade: {
        type: String,
        required: false
    }
});
EnrollmentSchema.plugin(mongoose_paginate_v2_1.default);
const Enrollment = mongoose_1.default.model('Enrollment', EnrollmentSchema);
exports.default = Enrollment;
