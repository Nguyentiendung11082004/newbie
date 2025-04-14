"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
const StudentSchema = new mongoose_1.default.Schema({
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
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'Class'
        }
    ]
}, { timestamps: true, versionKey: false });
StudentSchema.plugin(mongoose_paginate_v2_1.default);
const Student = mongoose_1.default.model("Student", StudentSchema);
exports.default = Student;
