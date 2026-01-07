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
exports.startReminderCron = void 0;
/// server/cron/reminderCron.ts
const node_cron_1 = __importDefault(require("node-cron"));
const enrollment_1 = __importDefault(require("../model/enrollment"));
const email_1 = require("../middlewares/email");
// hàm gửi mail tự động khi gần đến hạn đóng họp phí
const startReminderCron = () => {
    node_cron_1.default.schedule("0 8 * * *", () => __awaiter(void 0, void 0, void 0, function* () {
        var _a, _b;
        // cron.schedule("*/5 * * * * *", async () => {
        const today = new Date();
        // Lấy danh sách sắp đến hạn
        const almostDueEnrollments = yield enrollment_1.default.find({
            status: "Pending",
            // dueDate: { $gte: today, $lte: new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000) },
            // reminderSentBefore: false,
        })
            .populate("student_id", "name email StudentCode")
            .populate({
            path: "teaching_assignment_id",
            populate: { path: "subject_id", select: "name" }
        });
        for (const e of almostDueEnrollments) {
            const student = e.student_id;
            const teachingAssignment = e.teaching_assignment_id;
            const subjectName = teachingAssignment.subject_id.name;
            const className = ((_a = teachingAssignment.class_id) === null || _a === void 0 ? void 0 : _a.ClassName) || "Chưa có tên lớp";
            const dueDateFormatted = e.dueDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
            const htmlContent = `
              <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #2E86DE;">Xin chào ${student.name} (${student.StudentCode}),</h2>
                <p>Bạn có khoản học phí sắp đến hạn đóng:</p>
                <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                  <tr style="background-color: #f2f2f2;">
                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Môn học</th>
                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Lớp</th>
                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Phòng</th>
                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Hạn đóng</th>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">${subjectName}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${className}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${teachingAssignment.room}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; color: #e74c3c;">${dueDateFormatted}</td>
                  </tr>
                </table>
          
                <p>Vui lòng hoàn tất thanh toán trước hạn để tránh bị trễ.</p>
                <p>Cảm ơn bạn!</p>
          
                <p style="font-size: 12px; color: #999;">Đây là email tự động từ hệ thống quản lý sinh viên. Vui lòng không trả lời email này.</p>
              </div>
            `;
            yield (0, email_1.sendMail)(student.email, `Nhắc nhở sắp đến hạn đóng học phí môn ${subjectName}`, htmlContent);
            e.reminderSentBefore = true;
            yield e.save();
        }
        // Lấy danh sách quá hạn
        const overdueEnrollments = yield enrollment_1.default.find({
            status: "Pending",
            dueDate: { $lt: today },
            reminderSentAfter: false,
        }).populate("student_id subject_id");
        for (const e of overdueEnrollments) {
            const student = e.student_id;
            const teachingAssignment = e.teaching_assignment_id;
            const subjectName = teachingAssignment.subject_id.name;
            const className = ((_b = teachingAssignment.class_id) === null || _b === void 0 ? void 0 : _b.ClassName) || "Chưa có tên lớp";
            const dueDateFormatted = e.dueDate.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit", year: "numeric" });
            const htmlContent = `
              <div style="font-family: Arial, sans-serif; color: #333;">
                <h2 style="color: #e74c3c;">Xin chào ${student.name} (${student.StudentCode}),</h2>
                <p>Bạn đã <strong>quá hạn</strong> đóng học phí cho môn học sau:</p>
          
                <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
                  <tr style="background-color: #f2f2f2;">
                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Môn học</th>
                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Lớp</th>
                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Phòng</th>
                    <th style="padding: 8px; text-align: left; border: 1px solid #ddd;">Hạn đóng</th>
                  </tr>
                  <tr>
                    <td style="padding: 8px; border: 1px solid #ddd;">${subjectName}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${className}</td>
                    <td style="padding: 8px; border: 1px solid #ddd;">${teachingAssignment.room}</td>
                    <td style="padding: 8px; border: 1px solid #ddd; color: #e74c3c; font-weight: bold;">${dueDateFormatted}</td>
                  </tr>
                </table>
          
                <p>Vui lòng hoàn tất thanh toán ngay để tránh bị khóa quyền học tập hoặc áp dụng phạt trễ hạn.</p>
                <p>Cảm ơn bạn!</p>
          
                <p style="font-size: 12px; color: #999;">Đây là email tự động từ hệ thống quản lý sinh viên. Vui lòng không trả lời email này.</p>
              </div>
            `;
            yield (0, email_1.sendMail)(student.email, `⚠️ Nhắc nhở quá hạn đóng học phí môn ${subjectName}`, htmlContent);
            e.reminderSentAfter = true;
            yield e.save();
        }
    }));
};
exports.startReminderCron = startReminderCron;
