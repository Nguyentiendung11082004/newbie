"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthValidate = void 0;
const joi_1 = __importDefault(require("joi"));
exports.AuthValidate = joi_1.default.object({
    account: joi_1.default.string().required().trim().messages({
        "any.required": "Tên tài khoản là bắt buộc",
    }),
    password: joi_1.default.string().min(6).max(20).required().messages({
        "any.required": "Mật khẩu là bắt buộc",
        "string.min": "Password phai co it nhat {#limit} ky tu ",
        "string.max": "Password phai it hon {#limit} ky tu",
    })
});
