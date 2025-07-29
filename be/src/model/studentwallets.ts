import mongoose from "mongoose";

const TransactionSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["topup", "payment", "refund"],
        required: true
    },  
    amount: {
        type: Number,
        required: true
    },
    description:  {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})
const StudentWalletSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true,
        unique: true
    },
    balance: {
        type: Number,
        default: 0
    },
    transactions: [TransactionSchema]
}, {
    timestamps: true, versionKey: false
});

const StudentWallet = mongoose.model("StudentWallet", StudentWalletSchema)
export default StudentWallet