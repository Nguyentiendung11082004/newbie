"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
require("./teachingassignment");
const ClassSchema = new mongoose_1.default.Schema({
    ClassName: {
        type: String,
        required: true,
    },
    AcademicYear: {
        type: Number,
        required: true,
    },
    MajorId: [
        {
            type: mongoose_1.default.Schema.Types.ObjectId,
            ref: 'TeachingAssignment'
        }
    ]
}, {
    timestamps: true, versionKey: false
});
ClassSchema.plugin(mongoose_paginate_v2_1.default);
const Class = mongoose_1.default.model("Class", ClassSchema);
exports.default = Class;
