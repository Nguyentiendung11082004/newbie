"use strict";
// sse.route.ts
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendSSEToStudent = void 0;
const express_1 = __importDefault(require("express"));
const sseRouter = express_1.default.Router(); // ✅ bỏ export ở đây
const StudentConnect = new Map();
sseRouter.get('/student/:id', (req, res) => {
    const studentId = req.params.id;
    // const { userId } = req.user;
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders();
    // res.write(`data: Kết nối SSE thành công với sinh viên ${studentId}\n\n`);
    StudentConnect.set(studentId, res);
    req.on('close', () => {
        StudentConnect.delete(studentId);
        res.end();
    });
});
// ✅ default export cho sseRouter
exports.default = sseRouter;
// ✅ named export để gọi từ controller khác
const sendSSEToStudent = (studentId, message) => {
    const res = StudentConnect.get(studentId);
    if (res) {
        res.write(`data: ${message}\n\n`);
    }
};
exports.sendSSEToStudent = sendSSEToStudent;
