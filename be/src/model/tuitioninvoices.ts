import mongoose from 'mongoose';

const TuitionInvoiceSchema = new mongoose.Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Student",
        required: true
      },
      subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Subject",
        required: true
      },
      semester_id: {
        type: mongoose.Schema.Types.ObjectId,
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
})
const TuitionInvoice = mongoose.model("TuitionInvoice", TuitionInvoiceSchema)
export default TuitionInvoice