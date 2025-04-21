import mongoose, { Document, Schema, PaginateModel } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2';
interface ITeacher extends Document {
    authId: mongoose.Types.ObjectId;
    email: string;
    name: string;
    dob: Date;
    gender: "Nam" | "Nữ" | "Khác";
    phone: string;
    address: string;
}
const TeacherSchema = new Schema<ITeacher>(
    {
        authId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auth',
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
        },
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
        phone: {
            type: String,
            required: true,
        },
        address: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
    }
);
TeacherSchema.plugin(mongoosePaginate);
const Teacher = mongoose.model<ITeacher, PaginateModel<ITeacher>>("Teacher", TeacherSchema);
export default Teacher;