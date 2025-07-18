import mongoose, { PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
export interface IStudent extends Document {
    authId: mongoose.Types.ObjectId;
    name: string;
    StudentCode: string;
    dob: Date;
    gender: "Nam" | "Nữ" | "Khác";
    phone: string;
    address: string;
    classId: mongoose.Types.ObjectId[];
    major_id: mongoose.Types.ObjectId;
}

const StudentSchema = new mongoose.Schema({
    authId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true,
    },
    name: {
        type: String,
        required: true,
        lowercase: true,
        index: true,
    },
    StudentCode: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
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
    classId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Class',
        }
    ],
    major_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Major',
        required: true
    }
}, {
    timestamps: true,
    versionKey: false
});

StudentSchema.set('toJSON', {
    transform: (doc, ret) => {
        if (ret.name) {
            ret.name = ret.name
                .split(' ')
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ');
        }
        return ret;
    }
});

StudentSchema.plugin(mongoosePaginate);

const Student = mongoose.model<IStudent, PaginateModel<IStudent>>(
    "Student",
    StudentSchema
);

export default Student;
