import e from "cors";
import mongoose, { Schema } from "mongoose";

export enum GradeStatus {
    PASS = 'pass',
    FAIL = 'fail',
    PEDING = 'pending'
}
interface IGrade {
    student_id: mongoose.Types.ObjectId,
    subject_id: mongoose.Types.ObjectId,
    class_id: mongoose.Types.ObjectId,
    semester: mongoose.Types.ObjectId,
    teacher_id: mongoose.Types.ObjectId,
    processScore: number,
    midtermScore: number,
    finalScore: number,
    averageScore: number,
    status: GradeStatus
}
const GradeSchema = new mongoose.Schema<IGrade>({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student',
        required: true,
    },
    subject_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    class_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Class',
        required: true,
    },
    semester: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Semester',
        required: true
    },
    teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
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
})
const Grade = mongoose.model<IGrade>("Grade", GradeSchema);
export default Grade