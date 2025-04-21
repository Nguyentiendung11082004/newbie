import mongoose, { Document } from "mongoose";

export interface ITeachingAssignment extends Document {
  teacher_id: mongoose.Types.ObjectId;
  subject_id: mongoose.Types.ObjectId;
  class_id: mongoose.Types.ObjectId;
  semester: string;
  schedule: any;
}

export const ScheduSchema = new mongoose.Schema<any>({
  dayOfWeek: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
})
const TeachingAssignmentSchema = new mongoose.Schema<ITeachingAssignment>({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  subject_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Subject',
    required: true,
  },
  class_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Class',
    required: true,
  },
  semester: {
    type: String,
    required: true,
  },
  schedule: {
    type: [ScheduSchema],
    default: []
  }
}, {
  timestamps: true,
  versionKey: false
});

const TeachingAssignment = mongoose.model<ITeachingAssignment>(
  "TeachingAssignment",
  TeachingAssignmentSchema
);

export default TeachingAssignment;
