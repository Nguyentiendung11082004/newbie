import { Request, Response } from "express";
import { handleError } from "../middlewares/error";
import TeachingAssignment from "../model/teachingassignment";
import Enrollment from "../model/enrollment";
import Attendance from "../model/attdance";
import { StatusCodes } from "http-status-codes";
interface CustomRequest extends Request {
    user: {
        _id: string;
        role: string;
        email: string;
    };
}

export const CreateAttendance = async (req: Request, res: Response) => {
    try {
        const { teaching_assignment_id, date, attendances } = req.body;
        // console.log("req.body", req.body)
        // Kiểm tra xem lớp học và buổi học có hợp lệ không
        const teachingAssignment = await TeachingAssignment.findById(teaching_assignment_id);
        if (!teachingAssignment) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Lớp học không tồn tại' });
        }
        // // Kiểm tra xem các sinh viên có phải đã ghi danh lớp học này không
        const enrolledStudents = await Enrollment.find({ teaching_assignment_id: teaching_assignment_id });
        console.log("enrolledStudents", enrolledStudents)
        const enrolledStudentIds = enrolledStudents.map((enroll) => enroll.student_id.toString());
        console.log("enrolledStudentIds", enrolledStudentIds)
        // Kiểm tra xem các student_id trong body có hợp lệ không
        const invalidAttendances = attendances.filter(
            (attendance: { student_id: string }) => !enrolledStudentIds.includes(attendance.student_id)
        );
        if (invalidAttendances.length > 0) {
            return res.status(StatusCodes.BAD_REQUEST).json({ message: 'Một số sinh viên không có mặt trong lớp học này' });
        }

        // Kiểm tra xem điểm danh đã có cho ngày này chưa
        let existingAttendance = await Attendance.findOne({ teaching_assignment_id, date });

        // Nếu đã có, tiến hành cập nhật điểm danh
        if (existingAttendance) {
            existingAttendance.attendances = attendances;
            await existingAttendance.save();
            return res.status(StatusCodes.OK).json({
                message: 'Điểm danh đã được cập nhật',
                data: existingAttendance,
            });
        }
        const data = await Attendance.create({
            teaching_assignment_id,
            date,
            attendances,
        })
        return res.status(StatusCodes.OK).json({
            data: {
                message: 'Điểm danh đã được tạo',
                data: data,
            }
        });
    } catch (error) {
        handleError(res, error)
    }
}

export const getAttendanceHistory = async (req: CustomRequest, res: Response) => {
    try {
        const { role } = req.user;
        const { teaching_assignment_id, from, to } = req.query;

        let match: any = {};
        if (teaching_assignment_id) match.teaching_assignment_id = teaching_assignment_id;
        if (from || to) {
            match.date = {};
            if (from) match.date.$gte = new Date(String(from));
            if (to) match.date.$lte = new Date(String(to));
        }
        if (role === 'student') {
            match['attendances.student_id'] = req.user._id;
        }
        if (role === 'teacher') {
            match.created_by = req.user._id;
        }
        const data = await Attendance.find(match)
            .populate('teaching_assignment_id')
            .populate('attendances.student_id');

        return res.status(StatusCodes.OK).json({
            data: {
                message: 'Thành công',
                data: data
            }
        })
    } catch (error) {
        handleError(res, error)
    }
}