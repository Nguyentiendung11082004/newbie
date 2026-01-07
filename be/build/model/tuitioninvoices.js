"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TuitionInvoiceSchema = new mongoose_1.default.Schema({
    student_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    subject_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
    },
    semester_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Semester',
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["unpaid", "paid", "cancelled"],
        default: "unpaid"
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    paidAt: Date,
    note: String
}, {
    timestamps: true, versionKey: false
});
const TuitionInvoice = mongoose_1.default.model("TuitionInvoice", TuitionInvoiceSchema);
exports.default = TuitionInvoice;
