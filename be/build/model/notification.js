"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const NotificationSchema = new mongoose_1.default.Schema({
    title: {
        type: String,
        required: true,
    },
    content: {
        type: String,
        required: true,
    },
    sender_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Auth",
        required: true,
    },
    sender_role: {
        type: String,
        enum: ["admin", "teacher"],
        required: true,
    },
    target_type: {
        type: String,
        enum: ["all", "student", "teacher", "class", "subject"],
        default: "all",
    },
    class_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Class",
    },
    subject_id: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: "Subject",
    },
}, {
    timestamps: true,
    versionKey: false,
});
const Notification = mongoose_1.default.model("Notification", NotificationSchema);
exports.default = Notification;
