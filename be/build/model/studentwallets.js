"use strict";
// import mongoose from "mongoose";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const TransactionSchema = new mongoose.Schema({
//     type: {
//         type: String,
//         enum: ["topup", "payment", "refund"],
//         required: true
//     },  
//     amount: {
//         type: Number,
//         required: true
//     },
//     description:  {
//         type: String,
//         required: true
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     }
// })  
// const StudentWalletSchema = new mongoose.Schema({
//     student_id: {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Student",
//         required: true,
//         unique: true
//     },
//     balance: {
//         type: Number,
//         default: 0
//     },
//     transactions: [TransactionSchema]
// }, {
//     timestamps: true, versionKey: false
// });
// const StudentWallet = mongoose.model("StudentWallet", StudentWalletSchema)
// export default StudentWallet
const mongoose_1 = __importDefault(require("mongoose"));
const StudentWalletSchema = new mongoose_1.default.Schema({
    student_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Student",
        unique: true,
        required: true
    },
    balance: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true,
    versionKey: false
});
const StudentWallet = mongoose_1.default.model("StudentWallet", StudentWalletSchema);
exports.default = StudentWallet;
