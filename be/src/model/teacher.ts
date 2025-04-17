import mongoose, { Document, Schema } from "mongoose";
interface ITeacher extends Document {
    email: string;
    full_name: string;
    dob: Date;
    subject: string; // Môn học mà giáo viên dạy
    created_at: Date;
    authId: any;
}
const TeacherSchema = new Schema<ITeacher>(
    {
        email: {
            type: String,
            required: true,
            unique: true,
        },
        full_name: {
            type: String,
            required: true,
        },
        dob: {
            type: Date,
            required: true,
        },
        subject: {
            type: String,
            required: true,
        },
        authId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Auth',
            required: true
        },

    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false, 
    }
);
const Teacher = mongoose.model<ITeacher>("Teacher", TeacherSchema);
export default Teacher;