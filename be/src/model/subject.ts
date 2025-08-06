import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
export interface ISubject extends Document {
  name: string;
  code: string;
  description?: string;
  credits: number;
  tuitionFee: number;
  majorId: mongoose.Types.ObjectId;
  semester: mongoose.Types.ObjectId;
  prerequisite?: mongoose.Types.ObjectId[];
}

const SubjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  credits: { type: Number, required: true },
  description: { type: String },
  tuitionFee: { type: Number, required: true },
  majorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Major',
  },
  // semester: {
  //   type: mongoose.Schema.Types.ObjectId,
  //   ref: 'Semester',
  //   required: true
  // },
  prerequisite: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }]
}, { timestamps: true, versionKey: false }
);
SubjectSchema.plugin(mongoosePaginate);
const Subject = mongoose.model<ISubject, PaginateModel<ISubject>>(
  "Subject",
  SubjectSchema
);

export default Subject;
