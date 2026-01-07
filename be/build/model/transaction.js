"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const TransactionSchema = new mongoose_1.default.Schema({
    student_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    wallet_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "StudentWallet",
        required: true
    },
    type: {
        type: String,
        enum: ["topup", "payment", "refund"],
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ["Pending", "Success", "Failed"],
        default: "Pending"
    },
    enrollment_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Enrollment"
    },
    payment_method: {
        type: String,
        enum: ["wallet", "vnpay", "momo"]
    },
    gateway_transaction_id: {
        type: String,
        index: true
    },
    description: String
}, { timestamps: true, versionKey: false });
const Transaction = mongoose_1.default.model("Transaction", TransactionSchema);
exports.default = Transaction;
