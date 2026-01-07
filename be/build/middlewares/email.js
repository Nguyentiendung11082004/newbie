"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendMail = exports.transporter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.transporter = nodemailer_1.default.createTransport({
    service: 'gmail', // dùng Gmail
    auth: {
        user: process.env.EMAIL_USER, // email mày gửi đi
        pass: process.env.EMAIL_PASS, // app password (không phải mật khẩu gmail thường!)
    }
});
const sendMail = (to, subject, htmlContent) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("process.env.EMAIL_USER", process.env.EMAIL_USER);
    console.log("process.env.EMAIL_PASS", process.env.EMAIL_PASS);
    try {
        const info = yield exports.transporter.sendMail({
            from: `"Student Manager" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html: htmlContent
        });
        console.log(" Mail gửi thành công:", info.response);
        return true;
    }
    catch (error) {
        console.error(" Lỗi khi gửi mail:", (error === null || error === void 0 ? void 0 : error.message) || error);
        return false;
    }
});
exports.sendMail = sendMail;
