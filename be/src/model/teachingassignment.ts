import mongoose, { Document } from "mongoose";

export interface ITeachingAssignment extends Document {
  teacher_id: mongoose.Types.ObjectId;
  subject_id: mongoose.Types.ObjectId;
  class_id: mongoose.Types.ObjectId;
  semester: string;
  startDate: Date;
  numberOfClasses: number;
  dayOfWeek: string[];
  weeklySchedule: any;
  startTime: string;
  endTime: string;
  schedule: any;
  maxStudent: number;
  room: string;
}

export const ScheduSchema = new mongoose.Schema<any>({
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true }
});
export const SchemaWeeklySchedule = new mongoose.Schema<any>({
  dayOfWeek: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
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
  startDate: {
    type: Date,
    required: true,
  },
  numberOfClasses: {
    type: Number,
    required: true,
  },

  weeklySchedule: {
    type: [SchemaWeeklySchedule],
    default: []
  },
  schedule: {
    type: [ScheduSchema],
    default: []
  },
  maxStudent: {
    type: Number,
    required: true,
    default: 0 
  },
  room: {
    type: String,
    default: ''
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
