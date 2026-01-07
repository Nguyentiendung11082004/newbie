import mongoose, { Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IEnrollment extends Document {
  student_id: mongoose.Types.ObjectId;
  teaching_assignment_id: mongoose.Types.ObjectId;
  // semester?:  mongoose.Types.ObjectId;  // Học kỳ
  status: string;
  paymentStatus: string;
  StudentCode: string;
  enrolled_at: Date;
  course_schedule?: { dayOfWeek: string; startTime: string; endTime: string }[];
  final_grade?: string;  // Điểm môn học khi kết thúc
  dueDate: Date;
  reminderSentBefore: Boolean;
  reminderSentAfter: Boolean;
}


// collection đăng ký môn học
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
  dueDate: { type: Date, required: true }, 
  reminderSentBefore: { type: Boolean, default: false }, 
  reminderSentAfter: { type: Boolean, default: false },  
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'cancelled_by_student', 'cancelled_by_admin'],
    default: 'pending'
  },
  enrolled_at: {
    type: Date,
    default: Date.now
  },
  course_schedule: {
    type: [{ dayOfWeek: String, startTime: String, endTime: String }],
    default: []
  },
  final_grade: {
    type: String,
    required: false 
  }
});

EnrollmentSchema.plugin(mongoosePaginate);
const Enrollment = mongoose.model<IEnrollment, PaginateModel<IEnrollment>>('Enrollment', EnrollmentSchema);

export default Enrollment;
