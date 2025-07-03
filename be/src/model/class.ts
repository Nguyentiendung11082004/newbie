import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
import "./major";
import "./teachingassignment";
export interface IClass extends Document {
     ClassName: string;
     MajorId: mongoose.Types.ObjectId;
     AcademicYear: number;
}
const ClassSchema = new mongoose.Schema({
    ClassName: {
        type: String,
        required: true,
    },
    AcademicYear: {
        type: Number,
        required: true,
    },
    MajorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Major',
        required: true
    }
}, 
{
    timestamps: true, versionKey: false
})
ClassSchema.plugin(mongoosePaginate);
const Class = mongoose.model<IClass, PaginateModel<IClass>>(
    "Class",
    ClassSchema
)
export default Class;