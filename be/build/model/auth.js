"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const AuthSchema = new mongoose_1.default.Schema({
    account: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
        min: 6,
        max: 20,
    }
}, {
    timestamps: true, versionKey: false
});
const Auth = mongoose_1.default.model("Auth", AuthSchema);
exports.default = Auth;
