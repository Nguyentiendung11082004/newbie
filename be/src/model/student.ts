import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
export interface IStudent extends Document {
    name: string;
    dob: Date;
    gender: "Nam" | "Nữ" | "Khác";
    email?: string;
    phone: string;
    address: string;
    ClassId: mongoose.Types.ObjectId[];
}
const StudentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
    },
    dob: {
        type: Date,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Nam', 'Nữ', 'Khác'],
        required: true,
    },
    email: {
        type: String,
        unique: true
    },
    phone: {
        type: String,
        required: true,
    },
    address: {
        type: String,
        required: true,
    },
    ClassId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class'
        }
    ]
},
    { timestamps: true, versionKey: false }
)
StudentSchema.plugin(mongoosePaginate);
const Student = mongoose.model<IStudent, PaginateModel<IStudent>>(
    "Student",
    StudentSchema
);

export default Student;
