"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const SubjectSchema = new mongoose_1.default.Schema({
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    credits: { type: Number, required: true },
    description: { type: String },
    tuitionFee: { type: Number, required: true },
    majorId: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Major',
    },
    // semester: {
    //   type: mongoose.Schema.Types.ObjectId,
    //   ref: 'Semester',
    //   required: true
    // },
    prerequisite: [{ type: mongoose_1.default.Schema.Types.ObjectId, ref: "Subject" }]
}, { timestamps: true, versionKey: false });
SubjectSchema.plugin(mongoose_paginate_v2_1.default);
const Subject = mongoose_1.default.model("Subject", SubjectSchema);
exports.default = Subject;
