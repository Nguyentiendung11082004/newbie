<<<<<<< HEAD
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
=======
// import mongoose from "mongoose";

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

import mongoose from "mongoose";


>>>>>>> 6c1e0219d5928377aebd76055f2ed5f81d10f102
const StudentWalletSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
<<<<<<< HEAD
        required: true,
        unique: true
=======
        unique: true,
        required: true
>>>>>>> 6c1e0219d5928377aebd76055f2ed5f81d10f102
    },
    balance: {
        type: Number,
        default: 0
<<<<<<< HEAD
    },
    transactions: [TransactionSchema]
}, {
    timestamps: true, versionKey: false
});
=======
    }
}, {
    timestamps: true,
    versionKey: false
})
>>>>>>> 6c1e0219d5928377aebd76055f2ed5f81d10f102

const StudentWallet = mongoose.model("StudentWallet", StudentWalletSchema)
export default StudentWallet