"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_paginate_v2_1 = __importDefault(require("mongoose-paginate-v2"));
// collection ngành học
const MajorSchema = new mongoose_1.default.Schema({
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
MajorSchema.plugin(mongoose_paginate_v2_1.default);
const Major = mongoose_1.default.model("Major", MajorSchema);
exports.default = Major;
