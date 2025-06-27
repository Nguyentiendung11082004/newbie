import { Request, Response } from "express";
import { handleError } from "../middlewares/error";
import TeachingAssignment from "../model/teachingassignment";
import mongoose from "mongoose";
import { MOVED_TEMPORARILY, StatusCodes } from "http-status-codes";
import Enrollment from "../model/enrollment";
import Grade from "../model/grade";

interface IRequest extends Request {
    user: {
        _id: string;
        role: string;
        email: string;
        userId: string;
    };
}

interface student {
    name: string,
    _id: string,
    emmail: string
}
export const getStudentListForGrading = async (req: IRequest, res: Response) => {
    try {
        const { class_id, subject_id, semester } = req.body;
        const { role, userId } = req.user;
        if (!class_id || !subject_id || !semester) {
            return res.status(400).json({
                success: false,
                message: 'Chưa đủ thông tin về class_id, subject_id, semester',
            });
        }

        // hàm kiểm tra xem có đúng giảng vên này dạy lớp này không
        const assignment = await TeachingAssignment.findOne({
            class_id: new mongoose.Types.ObjectId(class_id as string),
            subject_id: new mongoose.Types.ObjectId(subject_id as string),
            semester: semester,
            teacher_id: userId,
        })
        if (!assignment) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: "Bạn không được nhập điểm lớp này"
            })
        }

        const enrollment = await Enrollment.find({
            teaching_assignment_id: assignment._id,
            status: 'Approved'
        }).populate('student_id', 'name studentCode email');

        const dataStudent = enrollment.map((e: any) => ({
            student_id: e.student_id._id,
            name: e.student_id.name,
            email: e.student_id.email,
        }))

        return res.status(StatusCodes.OK).json({
            message: "Thành công",
            data: dataStudent
        })
    } catch (error) {
        handleError(res, error)
    }
}

export const CreateGrade = async (req: IRequest, res: Response) => {
    try {
        const {
            class_id,
            subject_id,
            semester,
            student_id,
            processScore,
            midtermScore,
            finalScore,
        } = req.body;
        const { userId: teacher_id } = req.user;
        if (!class_id || !subject_id || !semester || !student_id) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'Thiếu thông tin class_id, subject_id, semester hoặc student_id.',
            });
        }

        const assignment = await TeachingAssignment.findOne({
            class_id: new mongoose.Types.ObjectId(class_id),
            subject_id: new mongoose.Types.ObjectId(subject_id),
            semester: semester,
            teacher_id: teacher_id,
        });

        if (!assignment) {
            return res.status(StatusCodes.FORBIDDEN).json({
                success: false,
                message: 'Bạn không được phép nhập điểm cho lớp hoặc môn học này trong học kỳ này.',
            });
        }

        const existingGrade = await Grade.findOne({
            class_id,
            subject_id,
            semester,
            student_id,
        });

        if (existingGrade) {
            return res.status(StatusCodes.CONFLICT).json({
                success: false,
                message: 'Sinh viên này đã có điểm. Vui lòng cập nhật thay vì thêm mới.',
            });
        }
        const averageScore = (
            (processScore * 0.3) +
            (midtermScore * 0.3) +
            (finalScore * 0.4)
        ).toFixed(2);
        const grade = await Grade.create({
            student_id,
            class_id,
            subject_id,
            semester,
            teacher_id,
            processScore,
            midtermScore,
            finalScore,
            averageScore: parseFloat(averageScore),
            status: 'completed',
        });

        return res.status(StatusCodes.OK).json({
            success: true,
            message: 'Nhập điểm thành công',
            data: grade,
        });

    } catch (error) {
        console.error('Error in CreateGrade:', error);
        handleError(res, error);
    }
};
export const GetMyGrades = async (req: IRequest, res: Response) => {
    try {
        const { subject_id, class_id } = req.body;
        const { userId } = req.user;

        const filter: any = {
            student_id: userId
        }
        if (subject_id) {
            filter.subject_id = subject_id;
        }
        if (class_id) {
            filter.class_id = class_id;
        }

        const grades = await Grade.find(filter)
            .populate('subject_id', 'name')
            .populate('class_id', 'name')
            .populate('teacher_id', 'name email');

        return res.status(200).json({
            success: true,
            message: 'Lấy bảng điểm thành công',
            data: grades
        });
    } catch (error) {
        handleError(res, error)
    }
}