import mongoose, { PaginateModel, Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
export interface ILeaveRequest {
    student_id: mongoose.Types.ObjectId;
    reason: string;
    fromDate: Date;
    toDate: Date;
    status: 'pending' | 'approved';
    teacher_id: mongoose.Types.ObjectId;
    rejectionReason: string;
    teaching_assignment_id: mongoose.Types.ObjectId;
}

const LeaveSchema = new Schema({
    student_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Student'
    },
    reason: {
        type: String,
        required: true,
    },
    fromDate: {
        type: Date,
        required: true,
    },
    toDate: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        required: true,
    },
    teacher_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    teaching_assignment_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'TeachingAssignment',
    },
    rejectionReason: {
        type: String,
    },
    reviewedAt: {
        type: Date, // lúc nào được duyệt
    }
}, {
    timestamps: true,
    versionKey: false
})
LeaveSchema.plugin(mongoosePaginate)
const Leave = mongoose.model<ILeaveRequest, PaginateModel<ILeaveRequest>>("Leave", LeaveSchema);
export default Leave;

