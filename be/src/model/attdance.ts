import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
export interface IAttendanceRecord {
    student_id: mongoose.Types.ObjectId;
    status: "present" | "absent";
    note: string;
  }
export interface IAttendance extends Document {
      student_id: mongoose.Types.ObjectId;
      teaching_assignment_id: mongoose.Types.ObjectId;
      date: Date;
      status: "present" | "absent";
      note: string;
      attendances: IAttendanceRecord[];
}
const AttendanceSchema = new mongoose.Schema({
    teaching_assignment_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TeachingAssignment',
      required: true
    },
    date: {
      type: Date,
      required: true
    },
    attendances: [
        {
          student_id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Student',
            required: true,
          },
          status: {
            type: String,
            enum: ['present', 'absent'],
            required: true,
          },
          note: {
            type: String,
            default: '',
          },
        },
      ],
  }, {
    timestamps: true, versionKey: false
  });
  const Attendance = mongoose.model<IAttendance, PaginateModel<IAttendance>>(
    "Attendance",
    AttendanceSchema
)
export default Attendance;