import mongoose, { Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IEnrollment extends Document {
  student_id: mongoose.Types.ObjectId;
  teaching_assignment_id: mongoose.Types.ObjectId;
  status: string;
  StudentCode: string;
  enrolled_at: Date;
  course_schedule?: { dayOfWeek: string; startTime: string; endTime: string }[];
  semester?: string;  // Học kỳ
  final_grade?: string;  // Điểm môn học khi kết thúc
}

const EnrollmentSchema = new mongoose.Schema<IEnrollment>({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  teaching_assignment_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TeachingAssignment',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Approved', 'CancelledByStudent', 'Cancel'],
    default: 'Pending'
  },
  enrolled_at: {
    type: Date,
    default: Date.now
  },
  course_schedule: {
    type: [{ dayOfWeek: String, startTime: String, endTime: String }],
    default: []
  },
  semester: {
    type: String,
    required: false
  },
  final_grade: {
    type: String,
    required: false
  }
});

EnrollmentSchema.plugin(mongoosePaginate);
const Enrollment = mongoose.model<IEnrollment, PaginateModel<IEnrollment>>('Enrollment', EnrollmentSchema);

export default Enrollment;
