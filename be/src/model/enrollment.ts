import mongoose, { Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
export interface IEnrollment extends Document {
  student_id: mongoose.Types.ObjectId;
  subject_id: mongoose.Types.ObjectId;
  status: string;
  enrolled_at: Date;
}
const EnrollmentSchema = new mongoose.Schema<IEnrollment>({
  student_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true
  },
  status: {
    type: String,
    enum: ['Pending', 'Enrolled', 'Cancelled'],
    default: 'Pending'
  },
  enrolled_at: {
    type: Date,
    default: Date.now
  }
});

EnrollmentSchema.plugin(mongoosePaginate)
const Enrollment = mongoose.model<IEnrollment, PaginateModel<IEnrollment>>('Enrollment', EnrollmentSchema);
export default Enrollment;
