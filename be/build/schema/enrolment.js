"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EnrollmentValidate = void 0;
const joi_1 = __importDefault(require("joi"));
exports.EnrollmentValidate = joi_1.default.object({
    subject_id: joi_1.default.string().required().messages({
        "string.empty": "Môn học là bắt buộc"
    }),
    teacher_id: joi_1.default.string().required().messages({
        "string.empty": "Giáo viên là bắt buộc"
    })
});
