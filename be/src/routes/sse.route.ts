// sse.route.ts

import express, { Response } from "express";

const sseRouter = express.Router(); // ✅ bỏ export ở đây

const StudentConnect = new Map<string, Response>();

sseRouter.get('/student/:id', (req, res: Response) => {
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
export default sseRouter;

// ✅ named export để gọi từ controller khác
export const sendSSEToStudent = (studentId: string, message: string) => {
    const res = StudentConnect.get(studentId);
    if (res) {
        res.write(`data: ${message}\n\n`);
    }
};
