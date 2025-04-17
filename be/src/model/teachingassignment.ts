import mongoose, { Document } from "mongoose";

export interface ITeachingAssignment extends Document {
  teacher_id: mongoose.Types.ObjectId;
  course_id: mongoose.Types.ObjectId;
  class_id: mongoose.Types.ObjectId;
  semester: string;
}

const TeachingAssignmentSchema = new mongoose.Schema<ITeachingAssignment>({
  teacher_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Teacher',
    required: true,
  },
  course_id: {
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
