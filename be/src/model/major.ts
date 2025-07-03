import mongoose, { Document, PaginateModel } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

export interface IMajor extends Document {
    name: string;
    code: string;
    description?: string;
}

const MajorSchema = new mongoose.Schema<IMajor>({
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
    description: {
        type: String,
        default: ""
    }
}, {
    timestamps: true,
    versionKey: false
});

MajorSchema.plugin(mongoosePaginate);

const Major = mongoose.model<IMajor, PaginateModel<IMajor>>(
    "Major",
    MajorSchema
);

export default Major;
