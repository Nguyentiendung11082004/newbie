/// server/cron/reminderCron.ts
import cron from "node-cron";
import Enrollment from "../model/enrollment";
import { sendMail } from "../middlewares/email";

// hàm gửi mail tự động khi gần đến hạn đóng họp phí
export const startReminderCron = () => {
    cron.schedule("0 8 * * *", async () => {
        // cron.schedule("*/5 * * * * *", async () => {
        const today = new Date();
        // Lấy danh sách sắp đến hạn
        const almostDueEnrollments = await Enrollment.find({
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
            const student = e.student_id as unknown as { name: string; email: string; StudentCode: string };
            const teachingAssignment = e.teaching_assignment_id as unknown as {
                subject_id: { name: string; code?: string };
                class_id: { ClassName?: string };
                room: string;
                startDate: Date;
            };

            const subjectName = teachingAssignment.subject_id.name;
            const className = teachingAssignment.class_id?.ClassName || "Chưa có tên lớp";
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
            await sendMail(
                student.email,
                `Nhắc nhở sắp đến hạn đóng học phí môn ${subjectName}`,
                htmlContent
            );
            e.reminderSentBefore = true;
            await e.save();
        }

        // Lấy danh sách quá hạn
        const overdueEnrollments = await Enrollment.find({
            status: "Pending",
            dueDate: { $lt: today },
            reminderSentAfter: false,
        }).populate("student_id subject_id");

        for (const e of overdueEnrollments) {
            const student = e.student_id as unknown as { name: string; email: string; StudentCode: string };
            const teachingAssignment = e.teaching_assignment_id as unknown as {
                subject_id: { name: string; code?: string };
                class_id: { ClassName?: string };
                room: string;
                startDate: Date;
            };

            const subjectName = teachingAssignment.subject_id.name;
            const className = teachingAssignment.class_id?.ClassName || "Chưa có tên lớp";
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

            await sendMail(
                student.email,
                `⚠️ Nhắc nhở quá hạn đóng học phí môn ${subjectName}`,
                htmlContent
            );

            e.reminderSentAfter = true;
            await e.save();
        }

    });
};
