import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
export interface ISubject extends Document {
    name: string;
    code: string;
    description?: string;
    credits: number;
    semester: string;
    prerequisite?: mongoose.Types.ObjectId[]; 
  }
  
const SubjectSchema = new mongoose.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    credit: { type: Number, required: true },
    description: { type: String },
    semester: { type: String },
    prerequisite: [{ type: mongoose.Schema.Types.ObjectId, ref: "Subject" }]
}, { timestamps: true, versionKey: false }
);
SubjectSchema.plugin(mongoosePaginate);
const Student = mongoose.model<ISubject, PaginateModel<ISubject>>(
    "Subject",
    SubjectSchema
);

export default Student;
