import mongoose, { Schema } from 'mongoose';


interface ISemester {
  name: string;
  code: string;
  startDate: Date;
  endDate: Date;
}
const SemesterSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

const Semester = mongoose.model('Semester', SemesterSchema);
export default Semester;