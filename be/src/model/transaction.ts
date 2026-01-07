import mongoose from "mongoose";
const TransactionSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
    },
    wallet_id: {
        type: mongoose.Schema.Types.ObjectId,
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
        type: mongoose.Schema.Types.ObjectId,
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

const Transaction = mongoose.model("Transaction", TransactionSchema);
export default Transaction